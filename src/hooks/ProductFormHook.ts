import { FieldType, SessaoType } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dev_log } from "@/lib/utils";
import { execApi } from "@/hooks/useApi";
import { useSidebarContext } from "@/context/SidebarContext";

export type PaymentStatesType = {
  paymentTab: "external" | "internal";
  paymentMethod: "pix" | "boleto" | "cartao" | "link";
  paymentStatus: "pending" | "paid" | "expired" | null;
  paymentSuccess: boolean;
  insuranceData?: {
    idSeguro: number;
    idSegurado: number;
  }
}

type ProductLayoutType = {
  idProduto: number;
  tpLayout: number;
  chLayout: string;
  nmLayout: string;
  layout: Partial<FieldType>[];
}

async function fetchProductLayout(idProduct?: string | null): Promise<ProductLayoutType>{
  if(!idProduct){
    throw new Error("Id do produto não encontrado");
  }
  console.log("fetching product layout")
  console.log(idProduct)
  try {
    const res: any = await execApi({
      url: `api/crm/product/find/layouts/${idProduct}`,
      method: "GET",
      data: {},
      isCrmApi: true,
      needLogout: true,
    });

    if("sucesso" in res.data){
      throw new Error("Erro ao buscar layout do produto \n" + JSON.stringify(res.data));
    }

    const layouts = res.data as ProductLayoutType[];
    let productLayoutSelected = layouts.find((layout) => layout.tpLayout === 19856 || layout.tpLayout === 19857);

    if(!productLayoutSelected){
      if(layouts.length > 0) {
        productLayoutSelected = layouts[0];
      } else {
        throw new Error("Layout não encontrado");
      }
    }
    return productLayoutSelected;

  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar layout do produto \n" + error);
  }
}

type ProductFormHookProps = {
  idProduct?: string | null,
  onSendNextSession?: (data: any) => Promise<any>,
  onSendFinishSessions?: (data: any) => Promise<any>,
  onSuccessFinishSessions?: (data: any) => any,
}

export const useProductFormHook = ({ idProduct, onSendNextSession, onSendFinishSessions, onSuccessFinishSessions }: Readonly<ProductFormHookProps>) => {
  // Usando API real
  const { data: layoutObj, isLoading: isLoadingLayout, isError: isErrorLayout, error: errorLayout, isSuccess: isSuccessLayout } = useQuery<ProductLayoutType>({
    queryKey: ["productLayout", idProduct],
    queryFn: () => fetchProductLayout(idProduct),
    enabled: !!idProduct,
    refetchOnWindowFocus: false,
  });

  const [sidebar, setSidebar] = useState<Partial<SessaoType>[] | null>(null);
  const [currentSessao, setCurrentSessao] =
    useState<Partial<SessaoType> | null>(null);
  
  // Context para scroll automático - opcional para evitar erro quando não está disponível
  let scrollToActiveItem: ((index: number) => void) | null = null;

  try {
    const context = useSidebarContext();
    scrollToActiveItem = context.scrollToActiveItem;
  } catch (error) {
    // Context não disponível, scroll será ignorado
    console.warn("SidebarContext não disponível, scroll será ignorado:", error);
    scrollToActiveItem = () => {};
  }

  const [fieldError, setFieldError] = useState<string | null>(null);
  const [postApiError, setPostApiError] = useState<string[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [
    dialogContinueFromLastSessionOpen,
    setDialogContinueFromLastSessionOpen,
  ] = useState(false);
  const [continueFromLastSession, setContinueFromLastSession] = useState({
    enabled: false,
    index: 0,
    userAccepted: false,
  });
  const [layoutProcessed, setLayoutProcessed] = useState(false);
  const [paymentStates, setPaymentStates] = useState<PaymentStatesType | null>(null)

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["sendFieldsToApi", idProduct],
    mutationFn: async ({data, isFinishSession}:{data: Partial<FieldType>[], isFinishSession?: boolean}) => {
      try {
        if(isFinishSession){
          return await onSendFinishSessions?.(data)
        }else{
          return await onSendNextSession?.(data)
        }
      } catch (error: any) {
        if(error?.response?.data?.mensagem){
          throw new Error(error.response.data.mensagem)
        }
        throw new Error(error?.message || "Erro desconhecido ao avançar sessão.")
      }
    },
    onSuccess: (data) => {
      dev_log(() => console.log(data))
      if(data?.sucesso){
        onSuccessFinishSessions?.(data)
        handleUpdateCurrentSession();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    onError: (error: any) => {
      dev_log(() => console.error("Error in mutation:", error));
      toast.error(error.message)
      setPostApiError([error.message]);
    },
  });

  useEffect(() => {
    if (layoutObj?.layout && isSuccessLayout && !layoutProcessed) {

      const layoutObjFields = [...layoutObj.layout];

      const camposPagamento = layoutObjFields.filter((campo) => campo.type === "pagamento");

      const camposPorSessao = layoutObjFields.reduce(
        (acc, campo) => {
          if(campo.type === "pagamento"){
            return acc;
          }
          const sessao = campo.sessao?.trim() || "Outros Campos";

          if (!acc[sessao]) {
            acc[sessao] = {
              titulo: sessao,
              descricao: "",
              campos: [],
            };
          }

          acc[sessao].campos.push(campo);

          return acc;
        },
        {} as Record<
          string,
          {
            titulo: string;
            descricao: string;
            campos: Partial<FieldType>[];
          }
        >
      );

      const sessoesArray = Object.entries(camposPorSessao).map(
        ([sessao, data]) => {
          return {
            sessao,
            titulo: findTitleBySessao(data.campos),
            descricao: findDescriptionBySessao(data.campos),
            campos: data.campos,
            active: false,
          };
        }
      );

      const apresentacaoSessao: Partial<SessaoType> = {
        title: "Visão Geral",
        descricao: "Detalhes e benefícios",
        checked: false,
        disabled: false,
        campos: [],
        typeSession: "apresentacao",
        active: true, // Já começa ativa
      };

      const sidebarItems: Partial<SessaoType>[] = [
        apresentacaoSessao,
        ...sessoesArray.map((sessao) => ({
          title: sessao.titulo ?? sessao.sessao,
          descricao: sessao.descricao,
          checked: false,
          disabled: true, // As próximas iniciam desabilitadas até ele avançar
          campos: sessao.campos,
          typeSession: "input" as const,
        }))
      ];

      const sessaoOutrosIndex = sidebarItems.findIndex(
        (item) => item.title === "Outros Campos"
      );

      // coloca a sessao "Outros Campos" no final
      if (sessaoOutrosIndex !== -1) {
        const sessaoOutros = sidebarItems[sessaoOutrosIndex];
        sessaoOutros.descricao = "Campos complementares ao formulário";
        sidebarItems.splice(sessaoOutrosIndex, 1);
        sidebarItems.push(sessaoOutros);
      }

      const resumeSessao: Partial<SessaoType> = {
        active: false,
        checked: false,
        disabled: true,
        title: "Resumo",
        descricao: "Reveja os dados preenchidos antes de enviar",
        typeSession: "resumo",
        campos: [],
      };

      const pagamentoSessao: Partial<SessaoType> = {
        active: false,
        checked: false,
        disabled: true,
        title: "Pagamento",
        descricao: "Selecione o método de pagamento",
        campos: camposPagamento,
        typeSession: "pagamento",
      };

      // Adiciona a sessão de resumo
      sidebarItems.push(resumeSessao);

      // Adiciona a sessão de cotação DEPOIS do resumo para Financiamento e Combo
      if (idProduct === "4" || idProduct === "5" || idProduct === "8" || idProduct === "9") {
        const cotacaoSessao: Partial<SessaoType> = {
          active: false,
          checked: false,
          disabled: true,
          title: "Cotações",
          descricao: "Simulações disponíveis",
          typeSession: "cotacao",
          campos: [
            { type: "hidden", campoApi: "cotacaoEscolhida", nome: "Cotações Escolhidas", conteudo: "", visual: false, obrigatorio: true },
            { type: "hidden", campoApi: "cotacoesDisponibilizadas", nome: "Cotações Disponibilizadas", conteudo: "", visual: false, obrigatorio: false }
          ],
        };
        sidebarItems.push(cotacaoSessao);
      }

      // Adiciona a sessão de pagamento no final
      if(camposPagamento.length > 0){
        sidebarItems.push(pagamentoSessao);
        // Inicializa o paymentStates apenas se houver sessão de pagamento
        setPaymentStates({
          paymentTab: "external",
          paymentMethod: "link",
          paymentStatus: null,
          paymentSuccess: false,
        });
      }

      setSidebar(sidebarItems);
      setLayoutProcessed(true);
      dev_log(() => console.log("Sessions array:", sessoesArray));
    }
  }, [layoutObj, isSuccessLayout, layoutProcessed]);

  // Effect para verificar continuar da última sessão
  useEffect(() => {
    if (sidebar && sidebar.length > 0 && layoutProcessed) {
      verifyContinueFromLastSession(sidebar);
    }
  }, [sidebar, layoutProcessed]);

  useEffect(() => {
    if (sidebar && sidebar.length > 0 && !currentSessao && layoutProcessed) {
      if (
        continueFromLastSession.index > 0 &&
        continueFromLastSession.enabled &&
        continueFromLastSession.userAccepted
      ) {
        handleSelectSessao(sidebar[continueFromLastSession.index]);
        return;
      }
      handleSelectSessao(sidebar[0]);
    }
  }, [sidebar, continueFromLastSession.index, continueFromLastSession.enabled, continueFromLastSession.userAccepted, currentSessao, layoutProcessed]);

  useEffect(() => {
    if (postApiError && postApiError.length > 0) {
      setDialogOpen(true);
    }
  }, [postApiError]);

  // Effect para scroll automático quando a sessão ativa muda
  useEffect(() => {
    if (sidebar && sidebar.length > 0 && scrollToActiveItem) {
      const activeIndex = sidebar.findIndex((item) => item.active === true);
      if (activeIndex !== -1) {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
          scrollToActiveItem(activeIndex);
        }, 150);
      }
    }
  }, [sidebar, scrollToActiveItem]);

  // Effect adicional para scroll quando currentSessao muda
  useEffect(() => {
    if (sidebar && currentSessao && sidebar.length > 0 && scrollToActiveItem) {
      const activeIndex = sidebar.findIndex((item) => item.active === true);
      if (activeIndex !== -1) {
        // Delay um pouco maior para garantir que a transição visual foi aplicada
        setTimeout(() => {
          scrollToActiveItem(activeIndex);
        }, 200);
      }
    }
  }, [currentSessao, sidebar, scrollToActiveItem]);

  const handleSelectSessao = (sessao: Partial<SessaoType>) => {
    if (!sidebar) return;
    
    const updatedSidebar = sidebar.map((item) => ({
      ...item,
      disabled: true,
      active: false,
    }));
    
    const sessaoIndex = updatedSidebar.findIndex((item) => item.title === sessao.title);
    if (sessaoIndex !== -1) {
      updatedSidebar[sessaoIndex] = {
        ...updatedSidebar[sessaoIndex],
        active: true,
        checked: false,
        disabled: false,
      };
      
             // aplica checked em todas as sessões anteriores
       updatedSidebar.forEach((item, index) => {
         if (index < sessaoIndex) {
           updatedSidebar[index] = {
             ...item,
             checked: true,
           };
         }
       });
    }
    
    setSidebar(updatedSidebar);
    setCurrentSessao(updatedSidebar[sessaoIndex]);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBackSession = () => {
    if (sidebar && sidebar.length > 0) {
      const currentIndex = sidebar.findIndex((item) => item.active === true);
      if (hasBackSession()) {
        handleSelectSessao(sidebar[currentIndex - 1]);
      }
    }
  };

  const handleNextSession = () => {
    if (
      !sidebar ||
      sidebar.length === 0 ||
      !currentSessao ||
      !currentSessao.campos
    ) {
      return;
    }


    dev_log(() => console.log(currentSessao.campos))
    // 1. Validação de campos obrigatórios
    const allRequiredFilled = currentSessao.campos.every((campo) => {
      if (campo.obrigatorio && campo.type !== "titulo_subtitulo") {
        return (
          campo.conteudo !== undefined &&
          campo.conteudo.toString().trim() !== ""
        );
      }
      return true;
    });

    if (!allRequiredFilled) {
      toast.error("Preencha todos os campos obrigatórios. (*)");
      setFieldError("Preencha todos os campos obrigatórios. (*)");
      return;
    }

    const dataToSend = currentSessao.campos
      .filter((item) => (item.type !== "titulo_subtitulo"))
      // .map((item) => ({
      //   ...item,
      //   conteudo:
      //     typeof item.conteudo === "string" && item.type !== "tabela" && item.qtdRespostas == undefined
      //       ? item.conteudo.replace(/[^\w\s;]/gi, "")
      //       : item.conteudo,
      // }));

    console.log(() => console.log(dataToSend));

    let hasError: string[] = [];

    // Validação de tamanho máximo
    dataToSend.forEach((item) => {
      if (item.visual !== false && item.obrigatorio) {
        if (
          item.tamanho &&
          item.conteudo &&
          item.conteudo.length > parseInt(item.tamanho)
        ) {
          hasError.push(
            `Campo "${item.nome}" deve ter no máximo ${item.tamanho} caracteres`
          );
        }
      }
    });


    const {hasError: hasErrorDataFields, dataToSend: dataToSendReviewed} = verifyDataFields(dataToSend, hasError)

    hasError = hasErrorDataFields


    dev_log(() => console.log(hasError));
    if (hasError.length > 0) {
      setPostApiError(hasError);
      dev_log(() => console.log(hasError))
      const message = hasError.join(", \n")
      toast.error(`Erro ao enviar os dados: \n\n ${message}`);
      return;
    }

    // 2. Envia os dados
    if(currentSessao.typeSession == "resumo"){
      mutate({data: dataToSendReviewed, isFinishSession: true});
      return
    }
    mutate({data: dataToSendReviewed});
  };

  const handleUpdateCurrentSession = () => {
    if (
      !sidebar ||
      sidebar.length === 0 ||
      !currentSessao ||
      !currentSessao.campos
    ) {
      return;
    }
    
    const updatedSidebar = [...sidebar];
    
    // 3. Marca a sessão atual como checked e desativa
    const currentIndex = updatedSidebar.findIndex((item) => item.active === true);
    if (currentIndex !== -1) {
      updatedSidebar[currentIndex] = {
        ...updatedSidebar[currentIndex],
        checked: true,
        active: false,
        disabled: true,
      };
    }

    // 4. Busca a próxima sessão ainda não checada
    const nextUncheckedIndex = updatedSidebar.findIndex(
      (item, index) => !item.checked && index > currentIndex
    );

    // 5. Define o índice de destino
    const targetIndex =
      nextUncheckedIndex !== -1 ? nextUncheckedIndex : updatedSidebar.length - 1;

    // 6. Atualiza todos os itens
    updatedSidebar.forEach((item, index) => {
      updatedSidebar[index] = {
        ...item,
        active: index === targetIndex,
        disabled: index !== targetIndex,
      };
    });

    // 7. Define a nova sessão atual
    setSidebar(updatedSidebar);
    setCurrentSessao(updatedSidebar[targetIndex]);
    setFieldError(null);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hasBackSession = () => {
    if (sidebar && sidebar.length > 0) {
      const currentIndex = sidebar.findIndex((item) => item.active === true);
      return currentIndex > 0;
    }
    return false;
  };

  const hasNextSession = (index?: number) => {
    if (sidebar && sidebar.length > 0) {
      if (index) {
        return index < sidebar.length - 1;
      }
      const currentIndex = sidebar.findIndex((item) => item.active === true);
      return currentIndex < sidebar.length - 1;
    }
    return false;
  };

  function verifyContinueFromLastSession(sidebarItems: Partial<SessaoType>[]) {
    let lastSessionIndex: number | null = null;

    for (let index = sidebarItems.length - 1; index >= 0; index--) {
      const item = sidebarItems[index];
      if (item.campos && item.campos.length > 0) {
        for (const campo of item.campos) {
          if (campo.type !== "titulo_subtitulo" && campo?.conteudo) {
            lastSessionIndex = index;
            break;
          }
        }
      }

      if (lastSessionIndex !== null) break;
    }

    let lastSessionIndexNotNull = lastSessionIndex ?? 0;

    // verifica se a ultima sessão encontrada tem todos campos obrigatorios preenchidos
    const lastSession = sidebarItems[lastSessionIndexNotNull];
    const allRequiredFilled = lastSession.campos?.every((campo) => {
      if (campo.obrigatorio && campo.type !== "titulo_subtitulo") {
        return campo.conteudo && campo.conteudo.trim() !== "";
      }
      return true;
    });

    if (allRequiredFilled) {
      lastSessionIndexNotNull++;
    }

    // Só atualiza se os valores forem diferentes
    setContinueFromLastSession(prev => {
      const newState = {
        enabled: lastSessionIndexNotNull !== 0,
        index: lastSessionIndexNotNull,
        userAccepted: false,
      };
      
      if (prev.enabled !== newState.enabled || prev.index !== newState.index) {
        return newState;
      }
      return prev;
    });

    setDialogContinueFromLastSessionOpen(lastSessionIndexNotNull !== 0);
  }

  function findDescriptionBySessao(fields: Partial<FieldType>[]) {
    const found = fields.find((item) => {
      if (item.type == "titulo_subtitulo") {
        return item;
      }
    });
    return found ? found.dsSubtitulo : "(Descrição não encontrada)";
  }

  function findTitleBySessao(fields: Partial<FieldType>[]) {
    const found = fields.find((item) => {
      if (item.type == "titulo_subtitulo") {
        return item;
      }
    });

    if (found) {
      return found.dsTitulo;
    }

    let notHaveSession = false;
    fields.forEach((item) => {
      if (item.type !== "titulo_subtitulo" && !item.sessao) {
        notHaveSession = true;
      }
    });

    if (notHaveSession) {
      return "Outros Campos";
    }
  }

  // Função para atualizar campos normais (não-API)
  const updateNormalField = useCallback((campoApi: string, newValue: string) => {
    setSidebar(prevSidebar => {
      if (!prevSidebar) return prevSidebar;
      
      return prevSidebar.map(session => ({
        ...session,
        campos: session.campos?.map(campo => 
          campo.campoApi === campoApi
            ? { ...campo, conteudo: newValue }
            : campo
        )
      }));
    });
    
    setCurrentSessao(prevCurrentSessao => {
      if (!prevCurrentSessao) return prevCurrentSessao;
      
      return {
        ...prevCurrentSessao,
        campos: prevCurrentSessao.campos?.map(campo => 
          campo.campoApi === campoApi
            ? { ...campo, conteudo: newValue }
            : campo
        )
      };
    });
  }, []);

  // Função para atualizar campos via API (apenas campos com target ou campoApi correspondente)
  const updateFieldValue = useCallback((targetName: string, newValue: string) => {
    
    setSidebar(prevSidebar => {
      if (!prevSidebar) return prevSidebar;
      
      return prevSidebar.map(session => ({
        ...session,
        campos: session.campos?.map(campo => 
          // Atualiza se o campo tem target ou campoApi correspondente
          (campo.target === targetName || campo.campoApi === targetName)
            ? { ...campo, conteudo: newValue }
            : campo
        )
      }));
    });
    
    setCurrentSessao(prevCurrentSessao => {
      if (!prevCurrentSessao) return prevCurrentSessao;
      
      return {
        ...prevCurrentSessao,
        campos: prevCurrentSessao.campos?.map(campo => 
          // Atualiza se o campo tem target ou campoApi correspondente
          (campo.target === targetName || campo.campoApi === targetName)
            ? { ...campo, conteudo: newValue }
            : campo
        )
      };
    });
  }, []);

  return {
    sidebar,
    currentSessao,
    fieldError,
    postApiError,
    dialogOpen,
    setDialogOpen,
    isPending,
    isError,
    error,
    isLoadingLayout,
    isErrorLayout,
    errorLayout,
    handleSelectSessao,
    handleBackSession,
    handleNextSession,
    handleUpdateCurrentSession,
    hasBackSession,
    hasNextSession,
    continueFromLastSession,
    setContinueFromLastSession,
    dialogContinueFromLastSessionOpen,
    setDialogContinueFromLastSessionOpen,
    paymentStates,
    setPaymentStates,
    updateFieldValue,
    updateNormalField,
  };
};

type OutPutVerifyDataFiedsProps = {
  hasError: string[],
  dataToSend: Partial<FieldType>[] 
}

function verifyDataFields(dataToSend: Partial<FieldType>[], hasError: string[]): OutPutVerifyDataFiedsProps {
  try {
      // formatar campos de data para padrão máquina
    dataToSend.forEach((item) => {
      if (item.type === "text" && item.mask === "data") {

        // se tiver mascara no conteudo, remover
        if(item.conteudo?.includes("/") || item.conteudo?.includes("-")) {
          dev_log(() => console.log("removendo mascara", item.conteudo))
          item.conteudo = item.conteudo.replace(/\//g, "").replace(/-/g, "")
        }

        const dia = item.conteudo?.slice(0, 2)
        const mes = item.conteudo?.slice(2, 4)
        const ano = item.conteudo?.slice(4, 8)

        if(!dia || !mes || !ano || dia.length !== 2 || mes.length !== 2 || ano.length !== 4) {
          hasError.push(
            `Campo "${item.nome}" deve ter 8 caracteres (DD-MM-YYYY)`
          );
          return {hasError, dataToSend}
        }

        item.conteudo = `${dia}-${mes}-${ano}`
        dev_log(() => console.log("data formatada", item.conteudo))
      }
    });

    try {
      // validar se a data é válida
      dev_log(() => console.log("validando data se é invalida"))
      dataToSend.forEach((item) => {
        if (item.type === "text" && item.mask === "data" && item.obrigatorio) {
          if(!item.conteudo) {
            hasError.push(
              `Campo "${item.nome}" é obrigatório`
            );
            return;
          };

          dev_log(() => console.log("data a validar", item.conteudo))
          // formatar data para padrão máquina
          const formattedDate = formatData(item.conteudo)
          dev_log(() => console.log("data formatada", formattedDate))
          const date = new Date(formattedDate)
          dev_log(() => console.log("data no objeto Date", formattedDate))
          if (isNaN(date.getTime())) {
            throw new Error("Data inválida")
          }
        }
      });

      return {hasError, dataToSend}
    } catch (error) {
      hasError.push(
        `Data inválida: ${error}`
      );
    }

    return {hasError, dataToSend}

  } catch (error) {
    dev_log(() => console.log(error))
    hasError.push(
      `Erro ao formatar campo de data: ${error}`
    );
    return {hasError, dataToSend}
  }
}

export function formatData(data: string) {
  if(!data) return data
  if(data?.includes("/") || data?.includes("-")) {
    data = data.replace(/\//g, "").replace(/-/g, "")
  }

  const dia = data?.slice(0, 2)
  const mes = data?.slice(2, 4)
  const ano = data?.slice(4, 8)
  return `${ano}-${mes}-${dia}`
}