import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Post } from "@/types/posts";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Créer une instance Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Configurer le rate limit: 10 requêtes par minute par IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

// Cache des résultats pendant 5 minutes
const CACHE_TTL = 300; // 5 minutes en secondes

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
    // Obtenir l'IP du client
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Vérifier le rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || "";

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    // Vérifier le cache
    const cacheKey = `posts:${keyword}`;
    const cachedData = await redis.get<Post[]>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Use the keyword directly as the search query, properly encoded for Reddit's API
    const searchQuery = encodeURIComponent(keyword);

    // Get access token
    const accessToken = await getRedditAccessToken();

    // Search Reddit posts with relevant parameters
    const response = await axios.get(
      `https://oauth.reddit.com/search?q=title%3A%22${searchQuery}%22&sort=new&limit=100`,
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

    // Mettre en cache les résultats
    await redis.set(cacheKey, posts, { ex: CACHE_TTL });

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
