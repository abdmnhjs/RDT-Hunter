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
        <Button className="bg-[#FF4500] hover:bg-[#FF4500]/50">
          View Summary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">Summary</DialogTitle>
        </DialogHeader>
        <DialogDescription>{post.summary}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
