import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { AxiosResponse } from "axios";
import { LuMail} from "react-icons/lu";
import { AiOutlineWhatsApp } from 'react-icons/ai';
import GenericTabs, { TabItem } from "../TabsGeneric";
import EmailTab from "./components/EmailTab";
import PhoneTab from "./components/PhoneTab";
import { queryClient } from "@/services/queryClient";
import { toast } from "sonner";

interface Props {
  id?: number | undefined | string
  onSuccess?: (etapa: number, selectedChannel?: { type: string; contact: any }) => void;
}

function EtapaCanal({ onSuccess, id }: Readonly<Props>) {
  const [tabsValue, setTabsValue] = useState("whats");
  const [selectedChannel, setSelectedChannel] = useState<{ type: string; contact: any } | null>(null);
  const [telefones, setTelefones] = useState<TelefoneItem[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const { data: contatos, isLoading } = useQuery({
    queryKey: ["fetchEnterprisePersonsById", id],
    queryFn: async () => {
      if (!id) return null;
      const res: AxiosResponse<any> = await execApi({
        url: `api/crm/lead/find/company/contacts/${id}`,
        method: "GET",
        data: {},
        isCrmApi: true,
      });

      console.log("res", res)

      if (res.status !== 200 || !res.data) {
        throw new Error("Erro ao buscar contatos da pessoa");
      }
      return res.data as ContactsResponseData[];
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() =>{
    if(contatos){
      try {
        const {phones, emails} = proccessContactsArry(contatos)
        console.log(phones, emails)
        setTelefones(phones)
        setEmails(emails)
        
      } catch (error) {
        console.log(error)
        toast.error("Erro ao processar dados de contato")
      }
    }
  }, [contatos])

  const tabsCanais: TabItem[] = [
    {
      value: "whats",
      label: "WhatsApp",
      icon: <AiOutlineWhatsApp />,
      disabled: false,
      content: <PhoneTab phones={telefones} isLoading={isLoading} onSelectChannel={(type, contact) => setSelectedChannel({ type, contact })} />,
    },
    {
      value: "email",
      label: "Email",
      icon: <LuMail />,
      disabled: false,
      content: <EmailTab emails={emails} isLoading={isLoading} onSelectChannel={(type, contact) => setSelectedChannel({ type, contact })} />
    },
  ];

  const handleCloseSheet = () => {
    queryClient.removeQueries({ queryKey: ["fetchEnterprisePersonsById", id],
      exact: false
     });
    document.getElementById("sheet-close-btn")?.click();
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg gap-10 h-[calc(100vh-6em)]">
      <div className="space-y-14 w-full max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl  text-center">
            Enviar documento
          </SheetTitle>
          <SheetDescription className="text-md  text-center">
            Selecione o meio de contato
          </SheetDescription>
        </SheetHeader>

        <GenericTabs
          tabs={tabsCanais}
          value={tabsValue}
          onValueChange={(value) => {
            setTabsValue(value);
            setSelectedChannel(null);
          }}
          className="w-full"
        />
      </div>

      <SheetFooter className="flex flex-col w-full max-w-lg">
        <SheetClose id="sheet-close-btn" className="hidden" />
        <Button 
          variant="secondary"
          className="w-full"
          onClick={handleCloseSheet}    
        >
          Cancelar
        </Button>
        <Button className="w-full" onClick={() => onSuccess?.(1, selectedChannel ?? undefined)} disabled={!selectedChannel}>
          Próximo
        </Button>
      </SheetFooter>
    </div>
  );
}


export default EtapaCanal;

interface ContactsResponseData {
  idSeguradoI2k: number;
  telefones: TelefoneItem[];
  email: EmailItem[];
}

interface EmailItem {
  idSeguradoI2k: number;
  idSegurado: number;
  idemail: number;
  email: string;
  tpPrincipal: number;
  chPrincipal: number;
  principal: boolean;
  tpScore: number;
  chScore: number;
  score: string;
  cdStatus: number;
  chStatus: number;
  status: string;
  blacklist: string;
  chblacklist: number;
  tpBlacklist: number;
}

interface TelefoneItem {
  idSeguradoI2k: number;
  idSegurado: number;
  idContato: number;
  nrDDD: number;
  nrTelefone: number;
  tpTelefone: number;
  chTelefone: number;
  tpPrincipal: number;
  chPrincipal: number;
  principal: boolean;
  tpScore: number;
  chScore: number;
  score: string;
  cdStatus: number;
  chStatus: number;
  status: string;
  blacklist: string;
  chblacklist: number;
  tpBlacklist: number;
}


function proccessContactsArry(contatos: ContactsResponseData[]){
  console.log(contatos)
  const phones = contatos.flatMap((contato) => contato.telefones)
  const emails = contatos.flatMap((contato) => contato.email)
  return {phones, emails}
}