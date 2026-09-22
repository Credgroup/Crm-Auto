import { Button } from "@/components/ui/button";
import NavContainer from "../../../components/LayoutRender/NavContainer";
import ProductFormSummary from "./ProductFormSummary";
import SessionContainer from "../../../components/LayoutRender/SessionContainer";
import { LuArrowLeft, LuLoaderCircle } from "react-icons/lu";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FieldType } from "@/types";
import { useProductFormHook } from "@/hooks/ProductFormHook";
import { SidebarProvider } from "@/context/SidebarContext";
import { toast } from "sonner";
import { dev_log } from "@/lib/utils";
import { execApi } from "@/hooks/useApi";
import { useOperationStore } from "@/store/operationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LuCopy, LuCheck } from "react-icons/lu";

// Utility function to generate short random IDs for proposals
function generateProposalId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Componente interno que usa o hook
function ProductFormContent() {
  const { id } = useParams();
  const [idProduct, setIdProduct] = useState<string | null>(null);
  const [seguradoInfoFields, setSeguradoInfoFields] = useState<Partial<FieldType>[]>([])
  const idOperation = useOperationStore(state => state.idOperation)

  const {
    sidebar,
    currentSessao,
    fieldError,
    handleSelectSessao,
    handleBackSession,
    hasBackSession,
    handleNextSession,
    hasNextSession,
    isPending,
    paymentStates,
    isLoadingLayout,
    isErrorLayout,
    errorLayout,
    setPaymentStates,
    updateFieldValue,
    updateNormalField,
  } = useProductFormHook({
    idProduct: idProduct,
    onSendNextSession: async (data) => {
      dev_log(() => console.log("OnSendNextSession", data))

      setSeguradoInfoFields((prev) => {
        return [...prev, ...data as Partial<FieldType>[]]
      })

      return {
        sucesso: true,
      }
    },
    onSendFinishSessions: async (data) => {
      dev_log(() => console.log("OnSendFinishSessions", data))

      try {

        const resultado = [...seguradoInfoFields, ...data].reduce((acc, item) => {
          if (!item.campoApi) return acc;

          if (item.campoApi == "dsEmail") {
            acc.email = [{ dsEmail: item.conteudo }]
          } else if (item.campoApi == "nrDdd" || item.campoApi == "telefone") {
            acc.contato = acc.contato ? [{
              ...acc.contato[0],
              [item.campoApi]: item.conteudo
            }] : [{
              [item.campoApi]: item.conteudo,
              tpTelefone: "2"
            }]
          } else {
            acc[item.campoApi] = item.conteudo;
          }

          return acc;
        }, {} as Record<string, any>);

        dev_log(() => console.log(resultado))

        const finalData: any = {
          segurado: resultado,
          idOperacao: idOperation,
          idProduto: idProduct,
        }

        dev_log(() => console.log(finalData))

        const res: any = await execApi({
          url: "api/crm/insurance/accession",
          method: "POST",
          data: finalData,
          isCrmApi: true,
          needLogout: true,
        })

        dev_log(() => console.log(res))

        if (!res.data.sucesso) {
          const msg = res.data.mensagem ?? "Erro ao registrar segurado"
          throw new Error(msg)
        } else {
          return res.data
        }

      } catch (error) {
        throw error
      }
    },
    onSuccessFinishSessions: (data) => {
      dev_log(() => console.log("OnSuccessFinishSessions", data))
      if (data?.idSeguro && data?.idSegurado) {
        toast.success("Segurado registrado com sucesso")
        setPaymentStates((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            insuranceData: {
              idSeguro: data?.idSeguro,
              idSegurado: data?.idSegurado,
            }
          }
        })
      }
    }
  });

  const [successForm, setSuccessForm] = useState(false);
  
  // Link Modal States
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [generatedProposalId, setGeneratedProposalId] = useState<string>("AB12X9");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#/checkout/${generatedProposalId}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log("id do produto", id);
      setIdProduct(id);
    }
  }, [id]);

  // Inicializa paymentStates se necessário
  useEffect(() => {
    if (currentSessao?.typeSession === "pagamento" && !paymentStates) {
      setPaymentStates({
        paymentTab: "external",
        paymentMethod: "link",
        paymentStatus: null,
        paymentSuccess: false,
      });
    }
  }, [currentSessao?.typeSession, paymentStates, setPaymentStates]);

  if (isLoadingLayout) {
    return (
      <div className="flex justify-center items-center h-full">
        <LuLoaderCircle className="animate-spin text-3xl" />
      </div>
    );
  }
  if (isErrorLayout) {
    return (
      <div>{t("product.errorLoadingLayout")}: {errorLayout?.message}</div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <Button
        className="w-fit px-0 ml-8 mt-8"
        variant="link"
        onClick={() => navigate(-1)}
      >
        <LuArrowLeft /> {t("product.back")}
      </Button>
      <div className="flex flex-row gap-8 p-8 w-full h-full py-4">
        <div className="flex flex-col gap-8 w-full !max-w-[1080px]">
          {successForm ? (
            <>
              <Card className="w-full p-6">
                <Button
                  variant="link"
                  className="mb-2 px-0"
                  onClick={() => navigate("/sales")}
                >
                  <LuArrowLeft />
                  {t("product.backToProducts")}
                </Button>
                <h1 className="text-2xl font-semibold mb-4">
                  {t("product.success")}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t("product.successDesc")}
                </p>
              </Card>
            </>
          ) : (
            <>
              <div className="w-full">
                {sidebar && <NavContainer navItems={sidebar} />}
              </div>
              <Card className="w-full p-6">
                {currentSessao?.campos && (
                  <SessionContainer
                    fields={currentSessao.campos.filter(
                      (item) =>
                        item.type !== "titulo_subtitulo" &&
                        item.visual !== false
                    )}
                    error={fieldError}
                    typeSession={currentSessao.typeSession}
                    allSessions={sidebar}
                    handleSelectSessao={handleSelectSessao}
                    paymentStates={paymentStates}
                    setPaymentStates={setPaymentStates}
                    idProduct={idProduct}
                    updateFieldValue={updateFieldValue}
                    updateNormalField={updateNormalField}
                  />
                )}
                <div className="w-full mt-10 flex flex-row justify-between gap-x-4">
                  {currentSessao?.typeSession === "pagamento" &&
                    paymentStates?.paymentSuccess && (
                      <Button
                        className="w-full cursor-pointer max-w-[200px]"
                        onClick={() => navigate("/sales")}
                      >
                        {t("product.backToProducts")}
                      </Button>
                    )}

                  {currentSessao?.typeSession !== "pagamento" && (
                    <Button
                      className="w-full cursor-pointer max-w-[200px]"
                      variant="secondary"
                      onClick={() => handleBackSession()}
                      disabled={!hasBackSession()}
                    >
                      {t("product.back")}
                    </Button>
                  )}

                  {(currentSessao?.typeSession === "input" ||
                    currentSessao?.typeSession === "apresentacao" ||
                    (currentSessao?.typeSession === "resumo" &&
                      hasNextSession())) && (
                      <Button
                        className="w-full cursor-pointer max-w-[200px]"
                        onClick={() => handleNextSession()}
                        disabled={!hasNextSession() || isPending}
                      >
                        {currentSessao?.typeSession === "resumo" ? "Simular Agora" : t("product.advance")}
                        {isPending && (
                          <LuLoaderCircle className="animate-spin ml-2" />
                        )}
                      </Button>
                    )}

                  {currentSessao?.typeSession === "cotacao" && (
                    <div className="flex flex-col gap-3 w-full max-w-[250px]">
                      <Button
                        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
                        onClick={() => {
                          let modelo = "Veículo Selecionado";
                          let anoFabricacao = "2023/2024";
                          let valorVeiculo = "0";

                          const sessionData = sidebar?.find((s: any) => s.title?.includes("Veículo") || s.title?.includes("Caminhão") || s.typeSession?.includes("veiculo"));
                          if (sessionData && sessionData.campos) {
                            modelo = sessionData.campos.find((f: any) => f.campoApi === "modelo")?.conteudo || sessionData.campos.find((f: any) => f.campoApi === "placa")?.conteudo || modelo;
                            anoFabricacao = sessionData.campos.find((f: any) => f.campoApi === "anoFabricacao")?.conteudo || anoFabricacao;
                            valorVeiculo = sessionData.campos.find((f: any) => f.campoApi === "valorVeiculo")?.conteudo || valorVeiculo;
                          }

                          const cotacaoSession = sidebar?.find((s: any) => s.typeSession === "cotacao");
                          const cotacoesString = cotacaoSession?.campos?.find((f: any) => f.campoApi === "cotacoesDisponibilizadas")?.conteudo;
                          let escolhas = cotacoesString ? JSON.parse(cotacoesString) : null;

                          if (!escolhas || !escolhas.financiamentos || escolhas.financiamentos.length === 0) {
                            escolhas = {
                              financiamentos: [
                                { banco: "Banco Santander", parcelas: 60, valorParcela: "2450.00", taxa: "1.99%", entrada: "50000" },
                                { banco: "Banco BV", parcelas: 48, valorParcela: "2850.00", taxa: "1.89%", entrada: "50000" }
                              ],
                              seguros: [
                                { seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 },
                                { seguradora: "Suhai", cobertura: "Roubo/Furto + PT", valorPremio: 1850.00, valorFranquia: 0.00 }
                              ]
                            };
                          }

                          const finQuotes = escolhas?.financiamentos || [];
                          const segQuotes = escolhas?.seguros || [];

                          let clienteNome = "";
                          let clienteCpf = "";
                          sidebar?.forEach((s: any) => {
                            s.campos?.forEach((f: any) => {
                              if (f.campoApi === "nome" && f.conteudo) clienteNome = f.conteudo;
                              if (f.campoApi === "cpf" && f.conteudo) clienteCpf = f.conteudo;
                            });
                          });

                          const mockData = {
                            vehicleInfo: { modelo, anoFabricacao, valorVeiculo },
                            clienteNome,
                            clienteCpf,
                            finQuotes,
                            segQuotes
                          };
                          
                          const newId = generateProposalId();
                          setGeneratedProposalId(newId);
                          
                          const existingDbStr = localStorage.getItem("proposals_db") || "{}";
                          const proposalsDb = JSON.parse(existingDbStr);
                          proposalsDb[newId] = mockData;
                          
                          localStorage.setItem("proposals_db", JSON.stringify(proposalsDb));
                          setLinkModalOpen(true);
                        }}
                      >
                        Liberar para o Cliente
                      </Button>
                      <Button
                        className="w-full cursor-pointer bg-[var(--cor-principal)] hover:bg-[var(--cor-principal)]/90 text-white shadow-md font-semibold"
                        onClick={() => {
                          let modelo = "Veículo Selecionado";
                          let anoFabricacao = "2023/2024";
                          let valorVeiculo = "0";

                          const sessionData = sidebar?.find((s: any) => s.title?.includes("Veículo") || s.title?.includes("Caminhão") || s.typeSession?.includes("veiculo"));
                          if (sessionData && sessionData.campos) {
                            modelo = sessionData.campos.find((f: any) => f.campoApi === "modelo")?.conteudo || sessionData.campos.find((f: any) => f.campoApi === "placa")?.conteudo || modelo;
                            anoFabricacao = sessionData.campos.find((f: any) => f.campoApi === "anoFabricacao")?.conteudo || anoFabricacao;
                            valorVeiculo = sessionData.campos.find((f: any) => f.campoApi === "valorVeiculo")?.conteudo || valorVeiculo;
                          }

                          const cotacaoSession = sidebar?.find((s: any) => s.typeSession === "cotacao");
                          const cotacoesString = cotacaoSession?.campos?.find((f: any) => f.campoApi === "cotacoesDisponibilizadas")?.conteudo;
                          let escolhas = cotacoesString ? JSON.parse(cotacoesString) : null;

                          if (!escolhas || !escolhas.financiamentos || escolhas.financiamentos.length === 0) {
                            escolhas = {
                              financiamentos: [
                                { banco: "Banco Santander", parcelas: 60, valorParcela: "2450.00", taxa: "1.99%", entrada: "50000" },
                                { banco: "Banco BV", parcelas: 48, valorParcela: "2850.00", taxa: "1.89%", entrada: "50000" }
                              ],
                              seguros: [
                                { seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 },
                                { seguradora: "Suhai", cobertura: "Roubo/Furto + PT", valorPremio: 1850.00, valorFranquia: 0.00 }
                              ]
                            };
                          }

                          const finQuotes = escolhas?.financiamentos || [];
                          const segQuotes = escolhas?.seguros || [];

                          let clienteNome = "";
                          let clienteCpf = "";
                          sidebar?.forEach((s: any) => {
                            s.campos?.forEach((f: any) => {
                              if (f.campoApi === "nome" && f.conteudo) clienteNome = f.conteudo;
                              if (f.campoApi === "cpf" && f.conteudo) clienteCpf = f.conteudo;
                            });
                          });

                          const mockData = {
                            vehicleInfo: { modelo, anoFabricacao, valorVeiculo },
                            clienteNome,
                            clienteCpf,
                            finQuotes,
                            segQuotes
                          };
                          
                          const newId = generateProposalId();
                          setGeneratedProposalId(newId);
                          
                          const existingDbStr = localStorage.getItem("proposals_db") || "{}";
                          const proposalsDb = JSON.parse(existingDbStr);
                          proposalsDb[newId] = mockData;
                          
                          localStorage.setItem("proposals_db", JSON.stringify(proposalsDb));
                          // Abre o checkout em modo vendedor numa nova aba
                          window.open(`${window.location.origin}/#/checkout/${newId}?mode=salesman`, "_blank");
                        }}
                      >
                        Apenas Assinatura
                      </Button>
                    </div>
                  )}

                  {currentSessao?.typeSession === "resumo" &&
                    !hasNextSession() && (
                      <Button
                        onClick={() => setSuccessForm(true)}
                        className="w-full max-w-[200px]"
                      >
                        {t("product.finish")}
                      </Button>
                    )}

                  {currentSessao?.typeSession === "pagamento" &&
                    paymentStates && (
                      <>
                        {paymentStates.paymentTab === "internal" &&
                          paymentStates.paymentStatus !== null &&
                          paymentStates.paymentMethod === "cartao" && (
                            <>
                              <Button
                                onClick={() => {
                                  console.log(
                                    "Gerando pagamento interno:",
                                    paymentStates
                                  );
                                  // Aqui você pode adicionar a lógica para processar o pagamento
                                }}
                                className="w-full max-w-[200px]"
                              >
                                Concluir pagamento
                              </Button>
                            </>
                          )}
                      </>
                    )}
                </div>
              </Card>
            </>
          )}
        </div>
        <div className="w-full sm:max-w-sm">
          <ProductFormSummary idProduct={idProduct} sidebar={sidebar} />
        </div>
      </div>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link Gerado com Sucesso! 🚀</DialogTitle>
            <DialogDescription>
              A proposta estruturada foi gerada. O cliente poderá revisar a simulação, aceitar os termos e assinar a CCB digitalmente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4 mb-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/#/checkout/${generatedProposalId}`}
                className="bg-muted font-mono text-sm"
              />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
              <span className="sr-only">Copy</span>
              {linkCopied ? <LuCheck className="h-4 w-4" /> : <LuCopy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter className="sm:justify-between items-center w-full gap-2 mt-4 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full font-bold border-2"
              onClick={() => {
                window.open(`${window.location.origin}/#/checkout/${generatedProposalId}`, "_blank");
              }}
            >
              Testar Link (Visão do Cliente)
            </Button>
            <Button
              type="button"
              variant="default"
              className="w-full bg-[var(--cor-principal)]"
              onClick={() => {
                setLinkModalOpen(false);
                setSuccessForm(true); // Redireciona para tela de sucesso da operação
              }}
            >
              Concluir Atendimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}

// Componente wrapper principal
export default function ProductFormWrapper() {
  return (
    <SidebarProvider>
      <ProductFormContent />
    </SidebarProvider>
  );
} 
