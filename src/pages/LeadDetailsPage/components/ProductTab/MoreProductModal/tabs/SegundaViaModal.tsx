import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { execApi } from "@/hooks/useApi";
import { toast } from "sonner";

type SegundaViaModalProps = {
  idParcela: number | string;
  disabled?: boolean;
  onSuccess?: () => void;
};



export default function SegundaViaModal({
  idParcela,
  disabled,
  onSuccess
}: Readonly<SegundaViaModalProps>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        idSeguroParcela: idParcela,
      };

      // Endpoint que não existe ainda, criado conforme solicitado usando baixaParcela como referência
      const url = `api/crm/insurance/manual/charge`;

      const res: any = await execApi({
        method: "POST",
        url,
        data: payload,
        isCrmApi: true
      });
      setOpen(false);
      console.log(res)

      if (res.data.sucesso == true) {
        toast.success("Sua cobrança manual foi realizada com sucesso.")
        onSuccess?.();
      }

    } catch (err) {
      console.error("Erro ao gerar segunda via:");
      toast.error("Ocorreu uma falha ao realizar a cobrança manual. Favor contatar o administrador.");
      setOpen(false);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary" disabled={disabled} title="Gerar Segunda Via">
          <Receipt className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Gerar Cobrança manual</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja gerar uma cobrança manual desta parcela?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
