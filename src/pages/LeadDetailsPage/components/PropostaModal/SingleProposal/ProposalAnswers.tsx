import { execApi } from "@/hooks/useApi";
import { FieldType, Proposal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuFile, LuTable2, LuUpload } from "react-icons/lu";
import axios from "axios";
import { format } from "date-fns";
import { useOperationStore } from "@/store/operationStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LucideLoader2 } from "lucide-react";
import DisplayInput from "@/components/LayoutRender/DisplayInput";
import { v4 } from "uuid";

const VITE_URL_API_CONVERT_TEMPLATE = import.meta.env.VITE_URL_API_CONVERT_TEMPLATE;

type ProposalAnswersProps = {
  id?: string;
  proposal: Partial<Proposal>;
};

export default function ProposalAnswers({
  id,
  proposal
}: Readonly<ProposalAnswersProps>) {
  const [fields, setFields] = useState<Partial<any>[]>([]);
  const { data, isLoading, error, isError, isSuccess, refetch } = useQuery({
    queryKey: ["proposalAswers", id],
    queryFn: () => fetchProposalAnswers(id ?? ""),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const idOperation  = useOperationStore(state => state.idOperation)

  function createPdfContentHTML(fields: Partial<FieldType>[]) {
    if (!fields || fields.length === 0) return '';

    let html = `
        <div class="pdf-container">
            <h1 style="text-align: center; font-size: 14pt; margin-bottom: 20px;">Respostas da Proposta</h1>
            <div class="columns-wrapper">
    `;
    
    // Simular o layout de duas colunas com divs
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const label = field?.campoApi || `Campo ${i + 1}`;
        const value = field?.conteudo || "--";

        // Usamos uma estrutura simples de div que será estilizada para colunas
        html += `
            <div class="pdf-field">
                <p class="pdf-label">${label}:</p>
                <p class="pdf-value">${value}</p>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;

    return html;
  }


  async function handleDownloadPDF() {
    if (!fields || fields.length === 0) return;
    
    const contentHTML = createPdfContentHTML(fields);
    
    // 1. Abre uma nova janela/aba
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
        
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Proposta</title>
                <style>
                    /* Estilos simples de impressão (Print Media Queries) */
                    @page { margin: 10mm; } /* Margem básica de 10mm */
                    body { font-family: 'Helvetica', sans-serif; }
                    .pdf-container { width: 100%; }
                    
                    /* Simulação de duas colunas */
                    .columns-wrapper { 
                        display: flex; 
                        flex-wrap: wrap; 
                        justify-content: space-between;
                    }
                    .pdf-field {
                        width: 48%; /* Aproximadamente metade da página */
                        margin-bottom: 16px;
                        /* Garante que o campo não seja cortado pela quebra de página */
                        page-break-inside: avoid; 
                    }
                    .pdf-label {
                        font-weight: bold;
                        font-size: 11pt;
                        margin: 0;
                    }
                    .pdf-value {
                        font-size: 11pt;
                        margin: 0;
                        margin-top: 2px;
                    }
                </style>
            </head>
            <body>
                ${contentHTML}
            </body>
            </html>
        `;

        // 3. Substitui o conteúdo inteiro do documento (document.documentElement é a tag <html>)
        // Isso é mais limpo e moderno do que usar document.write()
        printWindow.document.documentElement.innerHTML = fullHTML;

        // É bom dar um pequeno delay para garantir que o navegador renderize o DOM e os estilos
        // antes de chamar a impressão (especialmente com content-heavy pages).
        setTimeout(() => {
            printWindow.print();
            // printWindow.close(); // Opcional: fechar a aba após a impressão
        }, 300); 
    }
  }

  function formatProposalName(proposalName?: string) {
    if (!proposalName) return "proposta";
    return proposalName.replace(/[^a-zA-Z0-9]/g, "").replace(/ /g, "_").replace(/-/g, "_").replace(/:/g, "_");
  }

  function handleDownloadExcel() {
    if (!idOperation) {
      toast.error("Não foi possível encontrar o id da operação");
      return;
    }

    if(isDownloading) return;

    setIsDownloading(true);


    const data = {
      templateContainer: "templates",
      templateBlob: "property_template.xlsx",
      outputContainer: `arquivamento/documentos/proposta/${idOperation}/${format(new Date(), "yyyy")}/${format(new Date(), "MM")}`,
      fileName: `${formatProposalName(proposal.nmProposta)}_${format(new Date(), "dd_MM_HH_mm")}.xlsx`,
      dataFormat: "legacy",
      answers: fields,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    axios.post(`${VITE_URL_API_CONVERT_TEMPLATE}/generate`, data, { headers })
      .then((res) => {
        toast.success("Arquivo de respostas exportado com sucesso");

        const fileUrl = res.data.url + import.meta.env.VITE_THEME_BLOBS_KEY;

        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", data.fileName); // nome do arquivo sugerido
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(fileUrl)
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao exportar arquivo de respostas");
      })
      .finally(() => {
        setIsDownloading(false);
      });
  }

  useEffect(() => {
    if (isSuccess && data) {
      try {
        const fieldsObj = JSON.parse(data.dsRespostaJson);
        setFields(fieldsObj as any[]);
      } catch (error) {
        console.error("Erro ao processar resposta JSON:", error);
        toast.error("Erro ao processar resposta JSON");
      }
    }
  }, [isSuccess]);

  return (
    <div className="h-full">
      <div className="flex items-start mb-8 flex-col">
        <div className="flex items-center gap-4 w-full mb-6">
          <p className="font-medium text-xl">Respostas</p>{" "}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="aspect-square" size="icon" disabled={isDownloading}>
                    {isDownloading ? <LucideLoader2 className="animate-spin" /> : <LuUpload />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar respostas</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={handleDownloadExcel} asChild>
                <Button className="w-full justify-start" variant="ghost" disabled={isDownloading}>
                  <LuTable2/>
                  .XLSX (Excel)
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPDF} asChild>
                <Button className="w-full justify-start" variant="ghost" disabled>
                  <LuFile/>
                  .PDF (PDF)
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-4 gap-y-6">
          {isLoading &&
            !isError &&
            [1, 2, 3, 4, 5].map((item) => (
              <div
                key={`loading-${item}`}
                className="w-full h-8 bg-gray-200 dark:bg-muted/80 animate-pulse mb-2 rounded"
              ></div>
            ))}
          {!isLoading &&
            !isError &&
            data &&
            fields.map((field) => (
              field.type !== "titulo_subtitulo" && field.type !== "file" && (
                <DisplayInput field={field} key={v4()}/>
              )
            ))}
        </div>
        {isError && (
          <div className="w-full p-6 bg-red-200 dark:bg-red-800 bg-opacity-50 text-red-900 dark:text-red-100 rounded flex items-center justify-between">
            <div>
              <span className="text-base font-semibold">
                Erro ao carregar respostas
              </span>
              <p>{error.message}</p>
            </div>
            <Button variant="secondary" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type ProposalAnswersResponse = {
  idPropostaResposta: string;
  idProposta: string;
  dsRespostaJson: string;
  cdStatusPropostaResposta: string;
  dtCadastro: string;
  dtAlteracao: string;
};

async function fetchProposalAnswers(id: string) {
  let modelRes: ProposalAnswersResponse;
  if (!id) {
    modelRes = {
      idPropostaResposta: "",
      idProposta: "",
      dsRespostaJson: "",
      cdStatusPropostaResposta: "",
      dtCadastro: "",
      dtAlteracao: "",
    };
    return modelRes;
  }
  try {
    const response: any = await execApi({
      method: "GET",
      url: `api/crm/proposal/find/responses/${id}`,
      data: {},
      isCrmApi: true,
    });

    console.log(response);

    if ("sucesso" in response.data || response.status !== 200) {
      throw new Error(
        response.data.data.mensagem ?? "Resposta vazia ou inválida"
      );
    }

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error("Erro ao buscar respostas da proposta");
    throw new Error(error.message || "Erro ao buscar respostas da proposta");
  }
}
