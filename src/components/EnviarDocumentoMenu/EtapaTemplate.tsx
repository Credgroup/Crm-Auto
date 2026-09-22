import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { AxiosResponse } from "axios";
import GenericTabs, { TabItem } from "../TabsGeneric";
import { useLeadId } from "@/context/LeadContext";
import TemplatesTab from "./components/TemplatesTab";
import { queryClient } from "@/services/queryClient";
import { LuCornerUpLeft } from "react-icons/lu";
import { useOperationStore } from "@/store/operationStore";

interface Props {
  onSuccess?: (etapa: number, selectedTemplate?: any) => void;
  navigateTabs?: (value: number) => void;
  selectedChannel?: { type: string; contact: any } | null;
  id?: string | null;
  idOperation?: string;
}

function EtapaTemplate({ onSuccess, navigateTabs, selectedChannel }: Readonly<Props>) {
  const id = useLeadId();
  const [tabsValue, setTabsValue] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const idoperacao = useOperationStore((state) => state.idOperation);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["fetchTemplates", id],
    queryFn: async () => {
      if (!id) return;
      const res: AxiosResponse<any> = await execApi({
        url: `api/crm/multicanal/find/template/${idoperacao}`,
        method: "GET",
        data: {
          idoperacao: idoperacao,
        },
        isCrmApi: true,
      });

      if (res.status !== 200 || !res.data) {
        throw new Error("Erro ao buscar os templates");
      }
      console.log(res.data)
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const tabTemplate: TabItem[] = [
    {
      value: "template",
      label: "Templates",
      disabled: false,
      content: (
        <TemplatesTab
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={(id) => setSelectedTemplate(id)}
          channelType={selectedChannel?.type}
          isLoading={isLoading}
        />
      ),
    },
  ];
    
    const handleCloseSheet = () => {
    queryClient.removeQueries({queryKey: ["fetchTemplates", id],
      exact: false
    });
    document.getElementById("sheet-close-btn")?.click();
    };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg gap-10 h-[calc(100vh-6em)]">
      <div className="space-y-14 w-full max-w-lg">
        <SheetHeader>
            <Button
                size="icon"
                className="w-10 h-10"
                variant="secondary"
                onClick={() => navigateTabs?.(0)}
                >
                <LuCornerUpLeft />
            </Button>
          <SheetTitle className="text-2xl  text-center">
            Enviar documento
          </SheetTitle>
          <SheetDescription className="text-md  text-center">
            Selecione um template para o disparo
          </SheetDescription>
        </SheetHeader>

          <GenericTabs
            tabs={tabTemplate}
            value={tabsValue}
            onValueChange={setTabsValue}
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
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full"
            disabled={!selectedTemplate}
          >
            Enviar
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja disparar para esse segurado?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const template = templates?.find(
                  (t: any) => t.iddoc?.toString() === selectedTemplate
                );
                onSuccess?.(2, template);
              }}
            >
              Confirmar envio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </SheetFooter>
    </div>
  );
}

export default EtapaTemplate;