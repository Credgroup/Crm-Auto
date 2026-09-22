import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";

interface Inputs {
  pais: number;
  ddd: number;
  telefone: number;
  score: number;
}

function CriarEditarContatoModal() {
  const {
    register,
    formState: { errors },
  } = useForm<Inputs>();
  const registerWithMask = useHookFormMask(register);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="min-w-full">
          <SquarePen className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[30vw] max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Editar </DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 w-full">
          <div className="w-2/12">
            <Label htmlFor="pais">Pais</Label>
            <Input
              id="pais"
              type="text"
              {...registerWithMask("pais", ["+99"], {
                required: true,
                autoUnmask: true,
                clearIncomplete: true,
              })}
            />
            {errors.pais && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-2/12">
            <Label htmlFor="ddd">DDD</Label>
            <Input
              id="ddd"
              type="text"
              {...registerWithMask("ddd", ["999"], {
                required: true,
                autoUnmask: true,
                clearIncomplete: true,
              })}
            />
            {errors.ddd && (
              <span className="text-rose-400">
                Campo obrigatório não preenchido ou incorreto
              </span>
            )}
          </div>
          <div className="w-6/12">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="text"
              {...registerWithMask("telefone", ["99999-9999"], {
                required: true,
                autoUnmask: true,
                clearIncomplete: true,
              })}
            />
            {errors.telefone && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-2/12">
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              {...register("score", { required: true, min: 0, max: 10 })}
            />
            {errors.score && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button type="submit">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CriarEditarContatoModal;
