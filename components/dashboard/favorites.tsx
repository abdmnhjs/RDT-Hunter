import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export function Favorites() {
  const { posts, removePost, clearFavorites } = useFavorites();
  return (
    <ScrollArea className="h-[700px]">
      <Button
        variant="destructive"
        className="max-w-full my-4"
        onClick={clearFavorites}
      >
        Clear All Favorites
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Subreddit</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <Link
                  href={post.url}
                  target="_blank"
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>{post.subreddit}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removePost(post)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
