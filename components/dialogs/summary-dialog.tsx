import { Post } from "@/types/posts";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function SummaryDialog({ post }: { post: Post }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#290D04] hover:bg-[#290D04]/50">
          View Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#290D04] border-0 text-white hover:bg-[#3a1105]">
        <DialogHeader>
          <DialogTitle>Summary</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-white">
          {post.summary}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
