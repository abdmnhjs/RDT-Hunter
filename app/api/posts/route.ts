import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Post } from "@/types/posts";

async function getRedditAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Reddit credentials are not configured");
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || "";

    // Transform keyword into a Reddit search query with + operator
    const searchQuery = keyword.replace(/\s+/g, "+");

    // Get access token
    const accessToken = await getRedditAccessToken();

    // Search Reddit posts
    const response = await axios.get(
      `https://oauth.reddit.com/search?q=${searchQuery}&type=link&sort=hot`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "RDTHunter/1.0.0",
        },
      }
    );

    const posts: Post[] = response.data.data.children
      .filter((child: { data: { score: number } }) => child.data.score >= 20)
      .slice(0, 20)
      .map(
        (child: {
          data: {
            title: string;
            permalink: string;
            score: number;
            author: string;
            created_utc: number;
            subreddit_name_prefixed: string;
          };
        }) => ({
          title: child.data.title,
          url: `https://reddit.com${child.data.permalink}`,
          score: child.data.score,
          author: child.data.author,
          created: new Date(child.data.created_utc * 1000).toISOString(),
          subreddit: child.data.subreddit_name_prefixed,
        })
      );

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
