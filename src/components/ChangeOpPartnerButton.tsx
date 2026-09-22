import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { execPrc } from "@/hooks/useApi";
import { decrypt } from "@/hooks/useCrypt";
import { usePartnerStore } from "@/store/partnerStore";
import { useOperationStore } from "@/store/operationStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHubFunctions } from "@/context/HubFunctions";

type idParceiroOwner = {
  dschave: string;
  idparceiro: number;
  idusuario: number;
  nmparceiro: string;
};

export type Operation = {
  idoperacao: number;
  nmoperacao: string;
};

async function fetchParceiros(idUsuario?: string | null) {
  let criticalData: any = localStorage.getItem("erZNWpCKyq");
  criticalData = criticalData ? JSON.parse(decrypt(criticalData)) : null;
  if (!idUsuario || !criticalData) {
    throw new Error("Faltando idUsuario ou idParceiroOwner, refaça seu login");
  }
  const params = {
    appHost: "devadm.keepins.app",
    appIP: "0.0.0.0",
    idUsuario,
    idusuarioselect: idUsuario,
    idparceiroowner: criticalData.partner,
  };

  const res: any = await execPrc({
    url: "api/service",
    prc: "182",
    data: params,
    method: "POST",
  });

  if ("sucesso" in res.data) {
    throw new Error(res.data.mensagem);
  }
  if (res.data.codigo == "2") {
    throw new Error("Não existem parceiros disponíveis");
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }
  return [res.data] as idParceiroOwner[];
}

export async function fetchOperations(
  idParceiroOwner?: string | null,
  idUsuario?: string | null
) {
  if (!idParceiroOwner || !idUsuario) {
    throw new Error("Faltando idParceiroOwner or idUsuario");
  }

  const params = {
    idUsuario,
    idParceiroOwner,
  };

  const res: any = await execPrc({
    url: "api/service",
    prc: "54",
    data: params,
    method: "POST",
  });
  if ("sucesso" in res.data) {
    throw new Error("Erro ao buscar operações");
  }
  if (res.data.codigo == "2") {
    throw new Error("Não existem operações disponíveis");
  }
  if (Array.isArray(res.data)) {
    return res.data as Operation[];
  }

  return [res.data] as Operation[];
}

export default function ChangeOpPartnerButton() {
  const [open, setOpen] = useState(false);
  const usuario = useUsuarioStore((state) => state.usuario);
  const partnerId = usePartnerStore((state) => state.partnerId);
  const setPartnerId = usePartnerStore((state) => state.setPartnerId);
  const setOperation = useOperationStore((state) => state.setIdOperation);
  const idOperationSelected = useOperationStore((state) => state.idOperation);
  const { changeOperation: changeOperationEventHub } = useHubFunctions();

  let criticalData: any = localStorage.getItem("erZNWpCKyq");
  criticalData = criticalData ? JSON.parse(decrypt(criticalData)) : null;

  // Query para parceiros
  const {
    data: partners,
    isLoading: isLoadingPartners,
    isSuccess: isSuccessPartners,
    isError: isErrorPartners,
    error: errorPartners,
  } = useQuery<idParceiroOwner[]>({
    queryKey: ["parceiros"],
    queryFn: () => fetchParceiros(usuario?.idusuario.toString()),
    enabled: !!usuario && !!criticalData?.partner,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Query para operações
  const {
    data: operations,
    isLoading: isLoadingOperations,
    isSuccess: isSuccessOperations,
    isError: isErrorOperations,
    error: errorOperations,
  } = useQuery<Operation[]>({
    queryKey: ["operations", partnerId],
    queryFn: () => fetchOperations(partnerId, usuario?.idusuario.toString()),
    enabled: !!usuario && !!partnerId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // Encontrar dados selecionados
  const selectedPartner = partners?.find(p => p.idparceiro.toString() === partnerId);
  const selectedOperation = operations?.find(op => op.idoperacao.toString() === idOperationSelected);

  const handleSelectPartner = (parceiroId: string) => {
    if (parceiroId) {
      setPartnerId(parceiroId);
    }
  };

  const handleSelectOperation = (operation: string) => {
    if (operation) {
      setOperation(operation);
      changeOperationEventHub(operation);
    }
  };

  // Inicializar parceiro padrão
  useEffect(() => {
    if (isSuccessPartners && partners) {
      const hasCurrentPartner = localStorage.getItem("partner");
      if (hasCurrentPartner && partners.some((parceiro) => parceiro.idparceiro.toString() === hasCurrentPartner)) {
        handleSelectPartner(hasCurrentPartner);
        return;
      }
      handleSelectPartner(partners[0].idparceiro.toString());
    }
  }, [isSuccessPartners]);

  // Inicializar operação padrão
  useEffect(() => {
    if (isSuccessOperations && operations?.length) {
      const hasCurrentOperation = localStorage.getItem("operation");
      const operacaoEncontrada = operations.find(
        (op) => op.idoperacao.toString() === hasCurrentOperation
      );
      if (operacaoEncontrada) {
        handleSelectOperation(operacaoEncontrada.idoperacao.toString());
      } else {
        handleSelectOperation(operations[0].idoperacao.toString());
      }
    }
  }, [isSuccessOperations, operations]);

  // Tratar erros
  useEffect(() => {
    if (isErrorPartners) {
      toast.error(errorPartners.message);
    }
  }, [isErrorPartners]);

  useEffect(() => {
    if (isErrorOperations) {
      toast.error(errorOperations.message);
    }
  }, [isErrorOperations]);

  // Texto do trigger
  const triggerText = selectedPartner && selectedOperation 
    ? `${selectedPartner.nmparceiro} - ${selectedOperation.nmoperacao}`
    : "Carregando...";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-start">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Parceiros e operações
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Parceiro</Label>
            <Select onValueChange={(id) => setPartnerId(id)} value={partnerId ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um parceiro" />
              </SelectTrigger>
              <SelectContent>
                {!isLoadingPartners &&
                  partners?.length &&
                  partners.map((parceiro) => (
                    <SelectItem
                      key={parceiro.idparceiro}
                      value={String(parceiro.idparceiro)}
                    >
                      {parceiro.nmparceiro}
                    </SelectItem>
                  ))}
                {isLoadingPartners && (
                  <span className="text-gray-500">Carregando parceiros...</span>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Operação</Label>
            <Select
              onValueChange={(id) => handleSelectOperation(id)}
              value={idOperationSelected ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma operação" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingOperations && (
                  <span className="text-gray-500">Carregando operações...</span>
                )}
                {!isLoadingOperations && operations && operations.map((op) => (
                  <SelectItem key={op.idoperacao} value={String(op.idoperacao)}>
                    {op.nmoperacao}
                  </SelectItem>
                ))}
                {isErrorOperations && <span>{errorOperations.message}</span>}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}