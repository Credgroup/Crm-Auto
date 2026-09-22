import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { LuFileText } from "react-icons/lu";

export default function DialogSentedProposals() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start w-full px-2 h-8 font-normal rounded-sm cursor-pointer"
        >
          <LuFileText /> Ver Propostas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Propostas enviadas</DialogTitle>
          <DialogDescription>Essas são as propostas enviadas</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
