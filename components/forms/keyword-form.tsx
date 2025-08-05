"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { QueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  keyword: z
    .string()
    .min(1, {
      message: "A keyword is required",
    })
    .refine(
      async (keyword) => {
        const response = await axios.get(
          `/api/keyword/check?keyword=${keyword}`
        );
        return !response.data;
      },
      {
        message: "Keyword already exists",
      }
    ),
  subreddit: z.string().optional(),
});

export function KeywordForm({ queryClient }: { queryClient: QueryClient }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyword: "",
      subreddit: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axios.post("/api/keyword", {
        name: data.keyword,
      });
      await axios.post("/api/posts", {
        keyword: data.keyword,
        subreddit: data.subreddit,
      });
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2">
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keyword</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-[#290D04] border rounded-md"
                  placeholder="Enter a keyword"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subreddit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subreddit (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-[#290D04] border rounded-md"
                  placeholder="Enter a subreddit name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.isSubmitting ? (
          <Button type="submit" disabled>
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit" className="bg-[#FF4500] hover:bg-[#FF4500]/50">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
