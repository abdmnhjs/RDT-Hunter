import { Post } from "@/types/posts";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function PostCard({ title, url, author, subreddit }: Post) {
  return (
    <Link href={url} target="_blank">
      <Card className="border-0 bg-[#290D04] text-white">
        <CardHeader className="gap-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            From <span className="text-white">{author}</span> in{" "}
            <span className="text-white underline">
              r/
              {subreddit}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
