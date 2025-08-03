"use client";

import { Post } from "@/types/posts";

import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { PostCard } from "@/components/post-card";
import { watchCategories } from "@/lib/keywords/keywords";

export default function Home() {
  const allKeywords = watchCategories.flatMap((category) =>
    category.keywords.map((keyword) => ({ category: category.name, keyword }))
  );

  const queries = useQueries({
    queries: allKeywords.map(({ category, keyword }) => ({
      queryKey: ["posts", keyword],
      queryFn: async () => {
        const response = await axios.get(
          `/api/posts?keyword=${encodeURIComponent(keyword)}`
        );
        return { category, posts: response.data };
      },
    })),
  });

  // Group results by category
  const categorizedResults = watchCategories.map((category) => {
    const categoryQueries = queries.filter(
      (_, index) => allKeywords[index].category === category.name
    );

    return {
      name: category.name,
      queries: categoryQueries,
    };
  });

  return (
    <div className="container mx-auto p-4 space-y-12">
      {categorizedResults.map(({ name, queries }) => (
        <div key={name} className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">{name}</h2>
          <div className="space-y-8">
            {queries.map((query, index) => {
              const { data, isLoading, error } = query;
              // Find the starting index for this category's keywords
              const categoryStartIndex = allKeywords.findIndex(
                (k) => k.category === name
              );
              const keyword =
                allKeywords[categoryStartIndex + index]?.keyword ||
                `keyword-${index}`;
              const uniqueKey = `${name}-${index}-${keyword}`;

              if (isLoading) {
                return (
                  <div key={uniqueKey} className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-600">
                      {keyword}
                    </h3>
                    <p className="text-gray-500">
                      Chargement des opportunités...
                    </p>
                  </div>
                );
              }

              if (error) {
                return (
                  <div key={uniqueKey} className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-600">
                      {keyword}
                    </h3>
                    <p className="text-red-500">Erreur de chargement</p>
                  </div>
                );
              }

              if (!data?.posts?.length) {
                return (
                  <div key={uniqueKey} className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-600">
                      {keyword}
                    </h3>
                    <p className="text-gray-500">Aucun résultat trouvé</p>
                  </div>
                );
              }

              return (
                <div key={uniqueKey} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-600">
                    {keyword}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.posts.map((post: Post) => (
                      <PostCard key={post.url} {...post} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
