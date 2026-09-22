import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PersonEmail } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const emailSchema = z.object({
  dsEmail: z
    .string()
    .min(1, "Este campo é obrigatório")
    .email("Insira um e-mail válido"),
});

type Inputs = z.infer<typeof emailSchema>;

interface EmailDialogProps {
  onAddEmail: (newEmail: PersonEmail) => void;
}

export default function EmailDialog({
  onAddEmail,
}: Readonly<EmailDialogProps>) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      dsEmail: "",
    },
  });

  const onSubmit = (data: Inputs) => {
    const newEmail: PersonEmail = {
      dsEmail: data.dsEmail,
    };
    onAddEmail(newEmail);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon">
              <LuPlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Novo Email</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Email</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar um novo email
          </DialogDescription>
        </DialogHeader>

        <form className="w-full space-y-4">
          <div className="w-full space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" {...register("dsEmail")} />
            {errors.dsEmail && (
              <p className="text-red-500 text-sm">{errors.dsEmail.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
