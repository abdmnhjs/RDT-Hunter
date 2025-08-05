import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Link from "next/link";

export function Favorites() {
  const { posts, removePost, clearFavorites } = useFavorites();
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFavorites}
            >
              Clear All Favorites
            </Button>
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className="text-black">
            <Link href={post.url} target="_blank">
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.subreddit}</TableCell>
            </Link>

            <TableCell>
              <Button variant="destructive" onClick={() => removePost(post)}>
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
