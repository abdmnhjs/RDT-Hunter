import { Favorites } from "../favorites";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function FavoritesDialog() {
  return (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Favorites</DialogTitle>
        </DialogHeader>
        <Favorites />
      </DialogContent>
    </Dialog>
  );
}
