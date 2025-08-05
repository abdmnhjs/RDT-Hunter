import { useFavorites } from "@/hooks/use-favorites";
import { PostCardFavorite } from "../post-card-favorite";

export function Favorites() {
  const { posts } = useFavorites();
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCardFavorite key={post.url} {...post} />
        ))}
      </div>
    </div>
  );
}
