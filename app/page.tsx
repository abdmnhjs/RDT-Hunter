"use client";

import { Post } from "@/types/posts";
import { Keyword } from "@/types/keywords";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostCard } from "@/components/post-card";
import { Toaster } from "sonner";
import { KeywordForm } from "@/components/forms/keyword-form";

export default function Home() {
  const { data: keywords, isLoading: isLoadingKeywords } = useQuery<Keyword[]>({
    queryKey: ["keywords"],
    queryFn: async () => {
      const response = await axios.get("/api/keyword");
      return response.data;
    },
  });

  const queries = useQueries({
    queries: (keywords || []).map((keyword) => ({
      queryKey: ["posts", keyword.name],
      queryFn: async () => {
        const response = await axios.get<Post[]>(
          `/api/posts?keyword=${encodeURIComponent(keyword.name)}`
        );
        return { posts: response.data };
      },
    })),
  });

  if (isLoadingKeywords) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500">Chargement des mots-clés...</p>
      </div>
    );
  }

  if (!keywords) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Erreur lors du chargement des mots-clés</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Toaster />
      <KeywordForm />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queries.map((query, index) => {
          const { data, isLoading, error } = query;
          const keyword = keywords[index]?.name || `keyword-${index}`;
          const uniqueKey = `keyword-${index}`;

          return (
            <div key={uniqueKey} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-600">{keyword}</h3>
              {isLoading ? (
                <p className="text-gray-500">Chargement des opportunités...</p>
              ) : error ? (
                <p className="text-red-500">Erreur de chargement</p>
              ) : !data?.posts?.length ? (
                <p className="text-gray-500">Aucun résultat trouvé</p>
              ) : (
                <div className="space-y-4">
                  {data.posts.map((post: Post) => (
                    <PostCard key={post.url} {...post} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
