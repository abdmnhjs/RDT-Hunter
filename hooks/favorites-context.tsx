"use client";

import { Post } from "@/types/posts";
import { createContext, useEffect, useState } from "react";

type FavoritesContextType = {
  posts: Post[];
  addPost: (post: Post) => void;
  removePost: (post: Post) => void;
  clearFavorites: () => void;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  posts: [],
  addPost: () => {},
  removePost: () => {},
  clearFavorites: () => {},
});

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      setPosts(JSON.parse(favorites));
    }
  }, []);

  const addPost = (post: Post) => {
    setPosts((current) => {
      const existingPost = current.find((p) => p.url === post.url);
      if (existingPost) {
        return current;
      }
      const newPosts = [...current, post];
      localStorage.setItem("favorites", JSON.stringify(newPosts));
      return newPosts;
    });
  };

  const removePost = (post: Post) => {
    setPosts((current) => {
      const newPosts = current.filter((p) => p.url !== post.url);
      localStorage.setItem("favorites", JSON.stringify(newPosts));
      return newPosts;
    });
  };

  const clearFavorites = () => {
    setPosts([]);
    localStorage.removeItem("favorites");
  };

  return (
    <FavoritesContext.Provider
      value={{ posts, addPost, removePost, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
