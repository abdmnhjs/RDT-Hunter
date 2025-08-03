import { Post } from "@/types/posts";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowUp } from "lucide-react";

export function PostCard({ title, url, score, author, subreddit }: Post) {
  return (
    <Link href={url} target="_blank">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            From {author} in {subreddit}
          </CardDescription>
          <CardAction>
            <ArrowUp /> {score}
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
