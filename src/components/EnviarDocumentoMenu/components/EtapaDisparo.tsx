import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { AxiosResponse } from "axios";
import GenericTabs, { TabItem } from "../../TabsGeneric";
import DisparoTab from "./DisparoTab";
import { useUsuarioStore } from "@/store/usuarioStore";

interface ContactData {
  idSeguradoI2k: number;
  idSegurado: number;
  idemail?: number | null;
  email?: string | null;
  idContato?: number | null;
  nrDDD?: number | null;
  nrTelefone?: number | null;
  tpTelefone?: number | null;
  chTelefone?: number | null;
}

interface TemplateParameter {
  key: string;
}

interface SelectedTemplate {
  idoperacao: number;
  nmoperacaomulticanal: string;
  idoperacaomulticanal: number;
  iddoc: number;
  nmdoc: string;
  tpaviso: number;
  idexterno?: string | null;
  dsassunto?: string | null;
  parametros: TemplateParameter[] | null;
}

interface SelectedChannel {
  type: string;
  contact: ContactData;
}

interface Props {
  selectedChannel?: SelectedChannel | null;
  selectedTemplate?: SelectedTemplate | null;
  documentLink?: string | null;
  documentName?: string | null;
}

const buildGenericPayload = (
  selectedChannel: SelectedChannel | null | undefined,
  selectedTemplate: SelectedTemplate | null | undefined,
  documentLink: string | null | undefined,
  documentName: string | null | undefined
) => {
  const usuario = useUsuarioStore.getState().usuario;

  if (!selectedChannel || !selectedTemplate) return {};

  const { type, contact } = selectedChannel;

  const genericContact: ContactData = {
    idSeguradoI2k: contact.idSeguradoI2k,
    idSegurado: contact.idSegurado,
    idemail: type === "email" ? contact.idemail : null,
    email: type === "email" ? contact.email : null,
    idContato: type === "phone" ? contact.idContato : null,
    nrDDD: type === "phone" ? contact.nrDDD : null,
    nrTelefone: type === "phone" ? contact.nrTelefone : null,
    tpTelefone: type === "phone" ? contact.tpTelefone : null,
    chTelefone: type === "phone" ? contact.chTelefone : null,
  };

  const genericTemplate: SelectedTemplate = {
    idoperacao: selectedTemplate.idoperacao,
    nmoperacaomulticanal: selectedTemplate.nmoperacaomulticanal,
    idoperacaomulticanal: selectedTemplate.idoperacaomulticanal,
    iddoc: selectedTemplate.iddoc,
    nmdoc: selectedTemplate.nmdoc,
    tpaviso: selectedTemplate.tpaviso,
    idexterno: selectedTemplate.idexterno ?? "0",
    dsassunto: type === "email" ? selectedTemplate.dsassunto : null,
    parametros: selectedTemplate.parametros ?? [],
  };

  return {
    selectedChannel: { type, contact: genericContact },
    selectedTemplate: genericTemplate,
    documentLink,
    documentName,
    idusuario: usuario?.idusuario,
    typemsg: "document",
  };
};

export default function EtapaDisparo({
  selectedChannel,
  selectedTemplate,
  documentLink,
  documentName,
}: Readonly<Props>) {

  const queryClient = useQueryClient();

  const tabsValue = "disparo";

  const payloadDisparo = buildGenericPayload(
    selectedChannel,
    selectedTemplate,
    documentLink,
    documentName
  );

  const queryKey = ["sendDocumentPayloadDisparo", payloadDisparo] as const;

  const shouldFetch = Boolean(selectedChannel && selectedTemplate);

  const { data: resposta, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res: AxiosResponse<any> = await execApi({
        url: "api/crm/multicanal/enviar/disparo",
        method: "POST",
        data: payloadDisparo,
        isCrmApi: true,
      });

      if (res.status !== 200 || !res.data) {
        throw new Error("Falha ao consultar serviço de disparo");
      }

      return res.data;
    },
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleClose = () => {
    // Fecha a Sheet primeiro — o componente será desmontado.
    document.getElementById("sheet-close-btn")?.click();

    setTimeout(() => {
      queryClient.removeQueries({ queryKey, exact: true });
    }, 50);
  };

  const tabContent: TabItem[] = [
    {
      value: "disparo",
      label: "Disparo",
      disabled: false,
      content: (
        <DisparoTab
          isLoading={isLoading}
          resposta={resposta}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg gap-10 h-[calc(100vh-6em)]">
      <div className="space-y-14 w-full max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl text-center"></SheetTitle>
        </SheetHeader>

        <GenericTabs
          tabs={tabContent}
          value={tabsValue}
          onValueChange={() => {}}
          className="w-full"
        />
      </div>

      <SheetFooter className="flex flex-col w-full max-w-lg">
        <SheetClose id="sheet-close-btn" className="hidden" />

        <Button
          variant="secondary"
          className="w-full"
          disabled={isLoading}
          onClick={handleClose}
        >
          {isLoading ? "Aguarde..." : "Fechar"}
        </Button>
      </SheetFooter>
    </div>
  );
}