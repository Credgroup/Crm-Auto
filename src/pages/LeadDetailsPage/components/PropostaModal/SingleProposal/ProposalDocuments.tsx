import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { execApi } from "@/hooks/useApi";
import { Proposal, ProposalDocument } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FileText, RefreshCw, AlertCircle } from "lucide-react";
import DocumentItem from "./DocumentItem";
import { LuLoaderCircle } from "react-icons/lu";
import { usePartnerStore } from "@/store/partnerStore";

type ProposalDocumentsProps = {
  id?: string;
  proposal: Partial<Proposal>;
};

export default function ProposalDocuments({
  proposal,
  id,
}: Readonly<ProposalDocumentsProps>) {
  const { data, isLoading, error, isError, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ["proposalDocuments", id],
    queryFn: () => fetchProposalDocuments(proposal.idGrupoProposta),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  const idPartner = usePartnerStore((state) => state.partnerId)

  const title = idPartner === "39" ? "questionário de risco" : "proposta"

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error) {
      console.log(error.message);
    }
  }, [isError, error]);

  return (
    <div className="h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Documentos da Proposta
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LuLoaderCircle className="animate-spin h-6 w-6" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Erro ao carregar os documentos
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    {error.message}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetch()}
                    className="text-xs"
                  >
                    Tentar novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!data || data.length === 0) && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-medium mb-1">
                  Nenhum documento encontrado
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-700">
                  {title} ainda não possui documentos anexados.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((item) => (
              <DocumentItem key={item.idDocArquivo} doc={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchProposalDocuments(idGrupoProposta?: string) {
  if (!idGrupoProposta) {
    throw new Error("idGrupoProposta não existe");
  }

  const res: any = await execApi({
    url: "api/crm/document/find/groupProposal",
    data: { idGrupoProposta },
    method: "POST",
    isCrmApi: true,
    needLogout: true,
  });

  if (res.data.sucesso !== undefined) {
    throw new Error("Aconteceu algum erro na chamada: \n" + res.data.dsErro);
  }

  return res.data as Partial<ProposalDocument>[];
}
