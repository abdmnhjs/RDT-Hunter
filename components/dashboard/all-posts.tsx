import { Post } from "@/types/posts";
import { Keyword } from "@/types/keywords";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PostCard } from "../post-card";
import { KeywordForm } from "../forms/keyword-form";
import { CircleX } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function AllPosts() {
  const queryClient = useQueryClient();
  const { data: keywords, isLoading: isLoadingKeywords } = useQuery<Keyword[]>({
    queryKey: ["keywords"],
    queryFn: async () => {
      const response = await axios.get("/api/keyword");
      return response.data;
    },
  });

  const queries = useQueries({
    queries: (keywords || []).map((keyword) => ({
      queryKey: ["posts-saved", keyword.name],
      queryFn: async () => {
        const response = await axios.get<Post[]>(
          `/api/posts-saved?keyword=${encodeURIComponent(keyword.name)}`
        );
        return { posts: response.data };
      },
    })),
  });

  queryClient.invalidateQueries({ queryKey: ["posts-saved"] });

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/keyword`, { data: { id } });
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <KeywordForm queryClient={queryClient} />
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <div
            key={keyword.id}
            className="h-9 px-4 py-2 has-[>svg]:px-3 border-[#290D04] border rounded-md shadow-xs inline-flex items-center justify-between rounded-md gap-2"
          >
            <p className="text-sm font-medium">{keyword.name}</p>
            <CircleX
              className="w-4 h-4 cursor-pointer text-[#F94500]"
              onClick={() => handleDelete(keyword.id)}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queries.map((query, index) => {
          const { data, isLoading, error } = query;
          const keyword = keywords[index]?.name || `keyword-${index}`;
          const uniqueKey = `keyword-${index}`;

          return (
            <div
              key={uniqueKey}
              className="space-y-2 border-[#290D04] border p-4 rounded-md"
            >
              <div className="flex flex-row gap-2">
                <h3 className="text-4xl font-semibold">{keyword}</h3>
              </div>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">Error loading</p>
              ) : !data?.posts?.length ? (
                <p className="text-gray-500">No results found</p>
              ) : (
                <ScrollArea className="flex flex-col p-2 max-h-[500px]">
                  <div className="flex flex-col gap-4">
                    {data.posts.map((post: Post) => (
                      <PostCard key={post.url} {...post} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
