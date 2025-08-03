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
import { Search } from "lucide-react";
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
});

export function KeywordForm({ queryClient }: { queryClient: QueryClient }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axios.post("/api/keyword", { name: data.keyword });
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
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    {...field}
                    className="pl-9"
                    placeholder="Enter a keyword"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
