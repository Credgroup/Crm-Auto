import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { File } from "lucide-react";
import { execApi } from "@/hooks/useApi";

type BaixarParcelaModalProps = {
  idParcela: number | string;
  onSuccess?: () => void;
  disabled?: boolean;
};

export default function BaixarParcelaModal({
  idParcela,
  onSuccess,
  disabled
}: Readonly<BaixarParcelaModalProps>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    valorPago: "",
    dataPagamento: "",
    cdStatusParcela: "",
    observacao: "",
  });
  

  const handleSubmit = async () => {
    if (!formData.valorPago || !formData.dataPagamento || !formData.cdStatusParcela) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        idSeguroParcela: idParcela,
        valorPago: Number(formData.valorPago),
        dataPagamento: formData.dataPagamento,
        cdStatusParcela: Number(formData.cdStatusParcela),
        observacao: formData.observacao || null,
      };

      const url = `api/crm/insurance/manual/payment`;

      const res: any = await execApi({
        method: "PUT",
        url,
        data: payload,
        isCrmApi: true
      });

      console.log(res);

     await onSuccess?.(); // espera refetch terminar
setOpen(false);

      // reset form
      setFormData({
        valorPago: "",
        dataPagamento: "",
        cdStatusParcela: "",
        observacao: "",
      });

    } catch (err) {
      console.error("Erro ao dar baixa:", err);
      setError("Erro ao dar baixa na parcela.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary" disabled={disabled}>
          <File className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dar baixa na parcela</DialogTitle>
          <DialogDescription>
            Preencha os dados para confirmar a baixa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Valor pago *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.valorPago}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  valorPago: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Data de pagamento *</Label>
            <Input
              type="date"
              value={formData.dataPagamento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPagamento: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Status da parcela *</Label>
            <Select
              value={formData.cdStatusParcela}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  cdStatusParcela: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20934">Baixa manual</SelectItem>
                <SelectItem value="479">Cancelada</SelectItem>
                <SelectItem value="481">Pago em atraso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea
              value={formData.observacao}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observacao: e.target.value,
                }))
              }
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processando..." : "Confirmar baixa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}