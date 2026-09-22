import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Calendar, User } from "lucide-react";
import { ProposalDocument } from "@/types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { LuLoaderCircle } from "react-icons/lu";

type DocumentItemProps = {
  doc: Partial<ProposalDocument>;
};

interface DocumentDetails {
  idDocArquivo: number;
  dsDoc: string;
  chDocumentoAprovacao: number;
  nmDocOriginal: string;
}

export default function DocumentItem({ doc }: Readonly<DocumentItemProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: fetchDocumentDetails, data: documentDetails, isPending, error } = useMutation({
    mutationFn: async (idDocArquivo: number) => {
      const res: any = await execApi({
        url: "api/crm/document/find/ocr/base64",
        data: { idDocArquivo },
        method: "POST",
        isCrmApi: true,
        needLogout: true,
      });

      if (res.data.sucesso !== undefined) {
        throw new Error("Erro ao carregar documento: " + res.data.dsErro);
      }

      return res.data as DocumentDetails;
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (doc.idDocArquivo) {
      fetchDocumentDetails(doc.idDocArquivo);
    }
  };

  const handleDownload = () => {
    if (documentDetails?.dsDoc) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${documentDetails.dsDoc}`;
      link.download = documentDetails.nmDocOriginal || 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = () => {
    if (documentDetails?.dsDoc) {
      const blob = new Blob([Uint8Array.from(atob(documentDetails.dsDoc), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="default" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 2:
        return <Badge variant="destructive">Reprovado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-4">

            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center w-full gap-3">
                <div className="p-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-md">
                  <FileText className="h-5 w-5 text-[var(--cor-principal)]" />
                </div>
                <div>
                  <CardTitle className=" font-medium">
                    {doc.nmDoc}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {doc.nmDocOriginal}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {doc.dtCadastro && formatDate(doc.dtCadastro)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  ID: {doc.idUsuario}
                </div>
              </div>
            </div>

            <div className="flex items-end flex-col gap-2">
              <div>
              {doc.tpDocumentoAprovacao && getStatusBadge(doc.tpDocumentoAprovacao)}
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleOpenModal}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogDescription className="hidden"></DialogDescription>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Detalhes do Documento
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {isPending && (
                        <div className="flex items-center justify-center">
                          <LuLoaderCircle className="animate-spin h-6 w-6" />
                        </div>
                      )}
                      
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 text-sm">
                            Erro ao carregar documento: {error.message}
                          </p>
                        </div>
                      )}
                      
                      {documentDetails && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Nome do Arquivo:</span>
                              <p className="text-zinc-600 dark:text-zinc-70000">{documentDetails.nmDocOriginal}</p>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <div className="mt-1">
                                {getStatusBadge(documentDetails.chDocumentoAprovacao)}
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-center py-1">
                            <img src={documentDetails.dsDoc} alt={documentDetails.nmDocOriginal} className="block rounded-lg" />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleDownload}
                              className="flex-1"
                              variant="outline"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar Arquivo
                            </Button>
                            {
                              documentDetails.dsDoc && documentDetails.dsDoc.includes("data:application/pdf") && (
                                <Button 
                                  onClick={handlePreview}
                                  className="flex-1"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar PDF
                                </Button>
                              )
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
              </Dialog>
            </div>

          </div>

        </CardContent>
      </Card>
    </>
  );
}
