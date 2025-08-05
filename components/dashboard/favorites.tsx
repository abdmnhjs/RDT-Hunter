import { useFavorites } from "@/hooks/use-favorites";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import Link from "next/link";
import { Button } from "../ui/button";

export function Favorites() {
  const { posts, removePost, clearFavorites } = useFavorites();
  return (
    <div className="container mx-auto p-4 w-screen">
      <div className="border-[#290D04] border p-4 rounded-md w-full">
        <h3 className="text-4xl font-semibold mb-4">Favorites</h3>
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-sm">
            {posts.length} {posts.length === 1 ? "favorite" : "favorites"}
          </p>
          {posts.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => clearFavorites()}
            >
              Clear all
            </Button>
          )}
        </div>
        {posts.length === 0 ? (
          <p className="text-white text-center py-8">No favorites yet</p>
        ) : (
          <div className="rounded-md border border-[#290D04] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#290D04]/80">
                    <TableHead className="text-white min-w-[200px] md:min-w-[300px]">
                      Title
                    </TableHead>
                    <TableHead className="text-white min-w-[100px]">
                      Subreddit
                    </TableHead>
                    <TableHead className="text-white w-[100px] text-right pr-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.url} className="hover:bg-[#290D04]/5">
                      <TableCell className="font-medium">
                        <Link
                          href={post.url}
                          target="_blank"
                          className="hover:underline text-white line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-white">
                        r/{post.subreddit}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePost(post)}
                          className="whitespace-nowrap"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
