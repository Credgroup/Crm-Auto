import { Button } from "@/components/ui/button";
import SessionContainer from "@/components/LayoutRender/SessionContainer";
import { LuArrowLeft, LuLoaderCircle } from "react-icons/lu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useProductFormHook } from "@/hooks/ProductFormHook";
import { FieldType, SessaoType } from "@/types";

interface EtapaSimulacaoVendedorProps {
  idProduto?: string;
  onSuccess?: (idCotacaoEscolhida?: string) => void;
  navigateTabs?: (value: number) => void;
}

function hasPaymentSession(sidebar: Partial<SessaoType>[] | null) {
  return sidebar?.some((item) => item.typeSession === "pagamento");
}

export default function EtapaSimulacaoVendedor({
  idProduto,
  onSuccess,
  navigateTabs,
}: Readonly<EtapaSimulacaoVendedorProps>) {
  const [, setSeguradoInfoFields] = useState<Partial<FieldType>[]>([]);

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
    idProduct: idProduto,
    onSendNextSession: async (data) => {
      setSeguradoInfoFields((prev) => [...prev, ...(data as Partial<FieldType>[])]);
      return { sucesso: true };
    },
    onSendFinishSessions: async () => {
      // Avança para a tela final em vez de tentar acesso imediato.
      onSuccess?.();
      return { sucesso: true };
    },
    onSuccessFinishSessions: () => {
      // Ignorado no fluxo de simulação simplificada do drawer
    },
  });

  if (isLoadingLayout) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <LuLoaderCircle className="animate-spin text-3xl text-[var(--cor-principal)]" />
        <p className="text-muted-foreground">Carregando formulário...</p>
      </div>
    );
  }

  if (isErrorLayout) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>Erro ao carregar layout: {errorLayout?.message}</p>
        <Button className="mt-4" onClick={() => navigateTabs?.(1)}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-2em)]">
      <div className="flex items-center mb-6 pt-4 px-2">
        <Button variant="ghost" className="px-2 mr-2" onClick={() => navigateTabs?.(1)}>
          <LuArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold">Simulação e Cotação</h2>
      </div>

      <ScrollArea className="flex-1 w-full px-2">
        <div className="w-full pb-8">
          {currentSessao?.campos && (
            <SessionContainer
              fields={currentSessao.campos.filter(
                (item) => item.type !== "titulo_subtitulo" && item.visual !== false
              )}
              error={fieldError}
              typeSession={currentSessao.typeSession}
              allSessions={sidebar}
              handleSelectSessao={handleSelectSessao}
              paymentStates={paymentStates}
              setPaymentStates={setPaymentStates}
              idProduct={idProduto}
              updateFieldValue={updateFieldValue}
              updateNormalField={updateNormalField}
            />
          )}

          <div className="w-full mt-8 flex flex-row justify-between gap-x-4">
            {currentSessao?.typeSession !== "pagamento" && hasBackSession() && (
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handleBackSession()}
              >
                Voltar Etapa
              </Button>
            )}

            {(currentSessao?.typeSession === "input" ||
              currentSessao?.typeSession === "cotacao" ||
              currentSessao?.typeSession === "apresentacao" ||
              (currentSessao?.typeSession === "resumo" && hasPaymentSession(sidebar))) && (
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => handleNextSession()}
              >
                {isPending ? <LuLoaderCircle className="animate-spin" /> : "Avançar"}
              </Button>
            )}

            {!hasNextSession() &&
              currentSessao?.typeSession !== "pagamento" &&
              (!hasPaymentSession(sidebar) || currentSessao?.typeSession === "resumo") && (
                <Button
                  className="w-full"
                  onClick={() => onSuccess?.()}
                  disabled={isPending}
                >
                  {isPending ? <LuLoaderCircle className="animate-spin" /> : "Finalizar Simulação"}
                </Button>
              )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
