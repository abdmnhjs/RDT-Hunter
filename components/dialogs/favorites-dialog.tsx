import { Favorites } from "../favorites";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function FavoritesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-semibold">⭐ Favorites</Button>
      </DialogTrigger>
      <DialogContent
        className="!w-[95vw] !max-w-[95vw] !h-[90vh] !max-h-[90vh] md:!w-[80vw] md:!max-w-[80vw] md:!h-[80vh] md:!max-h-[80vh] lg:!max-w-[1000px] lg:!h-[800px] lg:!max-h-[800px] overflow-y-auto text-black"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Favorites />
      </DialogContent>
    </Dialog>
  );
}
