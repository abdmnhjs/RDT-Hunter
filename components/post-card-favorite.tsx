import { Post } from "@/types/posts";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CircleX } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export function PostCardFavorite({ title, url, author, subreddit }: Post) {
  const { removePost } = useFavorites();
  return (
    <Link href={url} target="_blank">
      <Card className="border-0 bg-[#290D04] text-white hover:bg-[#3a1105] transition-colors">
        <CardHeader className="gap-4 h-full">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">
            From <span className="text-white font-medium">{author}</span> in{" "}
            <span className="text-white underline font-medium">
              r/
              {subreddit}
            </span>
          </CardDescription>
          <CardAction>
            <Button
              onClick={(e) => {
                e.preventDefault();
                removePost({ id: url, title, url, author, subreddit });
                e.stopPropagation();
              }}
              className="hover:bg-[#4a1505]"
            >
              <CircleX className="w-5 h-5" />
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
