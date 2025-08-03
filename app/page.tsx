"use client";

import { Post } from "@/types/posts";

import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { PostCard } from "@/components/post-card";
import { devKeywords } from "@/keywords";

export default function Home() {
  const queries = useQueries({
    queries: devKeywords.map((keyword) => ({
      queryKey: ["posts", keyword],
      queryFn: async () => {
        const response = await axios.get(`/api/posts?keyword=${keyword}`);
        return response.data;
      },
    })),
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      {queries.map((query, index) => {
        const { data: posts, isLoading, error } = query;

        if (isLoading) {
          return (
            <div key={devKeywords[index]} className="space-y-4">
              <h2 className="text-2xl font-bold">{devKeywords[index]}</h2>
              <p>Loading...</p>
            </div>
          );
        }

        if (error) {
          return (
            <div key={devKeywords[index]} className="space-y-4">
              <h2 className="text-2xl font-bold">{devKeywords[index]}</h2>
              <p className="text-red-500">Error loading posts</p>
            </div>
          );
        }

        return (
          <div key={devKeywords[index]} className="space-y-4">
            <h2 className="text-2xl font-bold">{devKeywords[index]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts?.map((post: Post) => (
                <PostCard key={post.url} {...post} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
