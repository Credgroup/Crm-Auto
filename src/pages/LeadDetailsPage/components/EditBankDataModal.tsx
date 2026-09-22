import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LuPencil } from "react-icons/lu";
import { EmpresaDadosBancarios } from "./dadosBancariosColumns";
import { execApi } from "@/hooks/useApi";


type EditBankDataModalProps = {
  data: EmpresaDadosBancarios;
  refetchBankData?: () => void;
};

export default function EditBankDataModal({
  data,
  refetchBankData,
}: Readonly<EditBankDataModalProps>) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] =
    useState<EmpresaDadosBancarios>(data);

  const handleSubmit = async () => {
    try { 
      const payload = {
        tpPrincipal: formData.tpPrincipal,
        cdStatus: formData.cdStatus,
        };


      const url = `api/crm/company/update/bankdetail/${data.idEmpresaOperacao}/${data.idEmpresaDadosBancarios}`
    
      const res: any = await execApi({
        method: "PUT",
        url,
        data: payload,
        isCrmApi: true,
    });
    console.log(res)

      refetchBankData?.();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          setFormData(data);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8"
        >
          <LuPencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Dados Bancários</DialogTitle>
          <DialogDescription>
            Altere os campos abaixo e clique em editar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Tipo Principal</Label>
            <Select
              value={String(formData.tpPrincipal)}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  tpPrincipal: Number(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="373">Não Principal</SelectItem>
                <SelectItem value="372">Principal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* cdStatus */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={String(formData.cdStatus)}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  cdStatus: Number(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Ativo</SelectItem>
                <SelectItem value="7">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
