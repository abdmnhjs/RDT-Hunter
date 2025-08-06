import { Post } from "@/types/posts";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export function PostCard({ title, url, author, subreddit }: Post) {
  const { addPost, removePost, posts } = useFavorites();
  return (
    <Link href={url} target="_blank">
      <Card className="border-0 bg-[#290D04] text-white hover:bg-[#3a1105] transition-colors w-full">
        <CardHeader className="gap-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            From <span className="text-white">{author}</span> in{" "}
            <span className="text-white underline">
              r/
              {subreddit}
            </span>
          </CardDescription>
          <CardAction>
            <Heart
              className={`w-4 h-4 text-[#F94500] ${
                posts.some((post) => post.url === url) ? "fill-[#F94500]" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (posts.some((post) => post.url === url)) {
                  removePost({ id: url, title, url, author, subreddit });
                } else {
                  addPost({ id: url, title, url, author, subreddit });
                }
                e.stopPropagation();
              }}
            />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
