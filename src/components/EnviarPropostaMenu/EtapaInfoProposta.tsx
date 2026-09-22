import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { LuCornerUpLeft, LuLoaderCircle } from "react-icons/lu";
import { CadProposalGroup, Person } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePartnerStore } from "@/store/partnerStore";

interface EtapaInfoPropostaProps {
  onSuccess?: (etapa: Partial<CadProposalGroup>) => void;
  navigateTabs?: (value: number) => void;
  loading?: boolean;
  id?: string;
}

export default function EtapaInfoProposta({
  onSuccess,
  navigateTabs,
  loading: _loading,
  id,
}: Readonly<EtapaInfoPropostaProps>) {
  const [personsContacts, setPersonsContacts] = useState<Partial<Person>[]>([]);
  const [personIdSelect, setPersonIdSelect] = useState("");

  const idPartner = usePartnerStore((state) => state.partnerId);
  const title = idPartner === "39" ? "questionário de risco" : "proposta";

  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: ["fetchRepresentantesVinculadosContact"],
    queryFn: async () => {
      const res: any = await execApi({
        url: "api/crm/lead/find/representative",
        method: "POST",
        data: {
          idEmpresaOperacao: id,
        },
        isCrmApi: true,
      });
      if (!res) {
        throw new Error("Erro ao buscar clientes vinculados");
      }
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data && Array.isArray(data.items)) {
      setPersonsContacts(data.items);
    }
  }, [isSuccess, data]);

  const handleSelectClient = (val: string) => {
    setPersonIdSelect(val);
    onSuccess?.({
      idSeguradoI2k: val,
      idEmpresaOperacao: id,
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg gap-10 h-[calc(100vh-6em)]">
      <SheetHeader className="w-full max-w-lg mt-8">
        <Button
          size="icon"
          className="w-10 h-10 absolute left-4 top-4"
          variant="secondary"
          onClick={() => navigateTabs?.(0)}
        >
          <LuCornerUpLeft />
        </Button>
        <SheetTitle className="text-2xl text-center">Criar {title}</SheetTitle>
        <SheetDescription className="text-md text-center max-w-xs m-auto">
          Selecione o cliente para o qual a simulação será feita.
        </SheetDescription>
      </SheetHeader>
      
      <div className="flex flex-col gap-y-4 max-w-lg w-full mt-8">
        <Label htmlFor="cliente_select" className="text-lg">Cliente Alvo</Label>
        
        {isLoading && (
           <div className="flex items-center gap-2 text-muted-foreground mt-2">
             <LuLoaderCircle className="animate-spin" /> Buscando clientes...
           </div>
        )}
        
        {isError && (
          <p className="text-destructive mt-2">Erro ao buscar clientes: {error.message}</p>
        )}
        
        {isSuccess && personsContacts.length > 0 ? (
          <Select value={personIdSelect} onValueChange={handleSelectClient}>
            <SelectTrigger className="w-full h-12 text-md">
              <SelectValue placeholder="Selecione o Cliente" />
            </SelectTrigger>
            <SelectContent>
              {personsContacts.map((item) => (
                <SelectItem
                  key={item.idSeguradoI2k}
                  value={String(item.idSeguradoI2k)}
                >
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : isSuccess ? (
          <p className="text-muted-foreground mt-2">Nenhum cliente vinculado encontrado.</p>
        ) : null}
      </div>

      <div className="flex w-full gap-2 max-w-lg mt-auto pb-4">
        <SheetClose asChild className="!m-0 !p-0">
          <Button variant="secondary" className="w-full h-12">
            Cancelar
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
