import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Post } from "@/types/posts";
import axios from "axios";
import { getSummaryByAI } from "@/lib/ai/getSummaryByAI";
import { decode } from "html-entities";

export async function POST(request: NextRequest) {
  try {
    const { keyword, subreddit } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    // Validate subreddit if provided
    if (subreddit) {
      if (!/^[a-zA-Z0-9_]{3,21}$/.test(subreddit.trim().toLowerCase())) {
        return NextResponse.json(
          {
            error:
              "Invalid subreddit name. Must be 3-21 characters, alphanumeric and underscores only.",
          },
          { status: 400 }
        );
      }
    }

    // Vérifier si le keyword existe déjà, sinon le créer
    let keywordEntity = await prisma.keyword.findUnique({
      where: { name: keyword },
    });

    if (!keywordEntity) {
      keywordEntity = await prisma.keyword.create({
        data: { name: keyword },
      });
    }

    // Get Reddit credentials
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Reddit credentials are not configured" },
        { status: 500 }
      );
    }

    // Get Reddit access token
    const authResponse = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "MyApp/1.0.0",
        },
      }
    );

    const accessToken = authResponse.data.access_token;

    // Make the Reddit API request
    const searchUrl = subreddit
      ? `https://oauth.reddit.com/r/${subreddit}/search?q=${keyword}&restrict_sr=1`
      : `https://oauth.reddit.com/search?q=${keyword}`;

    const response = await axios.get(
      `${searchUrl}&sort=relevance&limit=100&t=month&selftext=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "MyApp/1.0.0",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch from Reddit API");
    }

    const data = response.data;
    const posts = data.data.children;

    // Filtrer les posts pour ne garder que ceux dont le titre contient tous les mots du keyword
    const keywordWords = keyword.toLowerCase().split(" ");
    const filteredPosts = posts.filter((post: { data: Post }) => {
      const title = post.data.title.toLowerCase();
      return keywordWords.every((word: string) => title.includes(word));
    });

    // Sauvegarder chaque post
    const savedPosts = await Promise.all(
      filteredPosts.map(async (post: { data: Post }) => {
        const postData = post.data;

        // Nettoyer le texte HTML
        const cleanText = decode(postData.selftext)
          // Supprimer les balises HTML
          .replace(/<!-- SC_OFF -->|<!-- SC_ON -->/g, "")
          .replace(/<[^>]*>/g, "")
          // Supprimer les sauts de ligne multiples
          .replace(/\n\s*\n/g, "\n")
          // Supprimer les espaces en début et fin
          .trim();

        const summary = await getSummaryByAI(cleanText);
        console.log("Résumé généré:", summary);

        try {
          return await prisma.postSaved.upsert({
            where: { url: postData.url },
            update: {
              keywords: {
                connect: { id: keywordEntity.id },
              },
            },
            create: {
              title: postData.title,
              url: postData.url,
              author: postData.author,
              subreddit: postData.subreddit,
              summary: summary,
              keywords: {
                connect: { id: keywordEntity.id },
              },
            },
          });
        } catch (error) {
          console.error("Error saving post:", error);
          return null;
        }
      })
    );

    // Filtrer les posts qui n'ont pas pu être sauvegardés
    const successfulPosts = savedPosts.filter((post) => post !== null);

    return NextResponse.json({
      message: "Posts retrieved and saved successfully",
      savedCount: successfulPosts.length,
      keyword: keywordEntity,
    });
  } catch (err) {
    console.error("Error in POST /api/posts:", err);

    // Check for specific error types
    if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_SECRET) {
      return NextResponse.json(
        { error: "Reddit credentials are not configured" },
        { status: 500 }
      );
    }

    const error = err as {
      response?: { status: number };
      code?: string;
      message?: string;
    };

    if (error?.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid or expired Reddit access token" },
        { status: 500 }
      );
    }

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate post URL detected" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to process request: " + (error?.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
