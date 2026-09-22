import {
  AtSign,
  BookOpen,
  FileText,
  Folder,
  NotebookPen,
  Package2,
  Star,
  User,
  UserRoundPen,
} from "lucide-react";
import ContatoTab from "./components/ContatoTab";
import DadosGeraisTab from "./components/DadosGeraisTab";
import PerfilHeader from "./components/PerfilHeader/index.tsx";
import SidebarLead from "./components/SidebarLead";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import { execApi } from "@/hooks/useApi";
import ContatoEnterpriseTab from "./components/ContatoEnterpriseTab";
import { decrypt } from "@/hooks/useCrypt";
import IdNotFound from "./components/IdNotFound";
import PropostaTab from "./components/PropostaTab";
import LeadDetailsPageSkeleton from "@/components/Skeletons/LeadDetailsPageSkeleton.tsx";
import InteresseTab from "./components/InteresseTab/index.tsx";
import HistoricoTab from "./components/HistoricoTab.tsx";
import CanaisTab from "./components/CanaisTab.tsx";
import ProductTab from "./components/ProductTab/index.tsx";
import AnotacaoTab from "./components/AnotacaoTab.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { usePartnerStore } from "@/store/partnerStore.ts";
import { LeadContext } from "@/context/LeadContext.tsx";
import {empresasDadosBancariosLayout} from "./components/dadosBancariosColumns.tsx";

import CadastroDeColaborador from "./components/CadastroDeColaborador.tsx";

type fetchLeadDetailsByIdType = {
  id?: string;
  idOperation: string | null;
  type?: "enterprise" | "person";
};

type DadosBancariosType = {
  id?: string;
  type?: "enterprise" | "person";
};

async function fetchLeadDetailsById({
  
  id,
  idOperation,
  type,
}: Readonly<fetchLeadDetailsByIdType>) {
  if (!id || !type || (id && type == "person" && !idOperation)) {
    toast.error("Lead não selecionado");
    return [];
  }

  const url =
    type === "enterprise"
      ? `api/crm/company/find/${id}`
      : `api/crm/lead/find/${id}`;

  const res = await execApi({
    method: "GET",
    url,
    data: {},
    isCrmApi: true,
  });

  if (res.status !== 200) {
    toast.error("Erro ao buscar detalhes do lead");
    return [];
  }
  return res.data;
}

async function DadosBancarios({
  id,
  type,
}: Readonly<DadosBancariosType>) : Promise<empresasDadosBancariosLayout> {
  const url = `api/crm/company/find/bankdetail/${id}`
  if (type === "person" ){
    throw new Error("Tipo de person não aceito para essa api")
  }
  
  const res: any = await execApi({
    method: "GET",
    url,
    data: {},
    isCrmApi: true,
  });

  if (res.data && res.data.sucesso == false){
    const msg = res.data.mensagem ?? "Tipo não encontrado"
    throw new Error(msg)
  }

  return res.data as empresasDadosBancariosLayout
  
}
type menuItemType = {
  id: number;
  name: string;
  icon: any;
  active: boolean;
  component?: ReactNode | null;
};

type searchParamsType = {
  id: string;
  type?: "enterprise" | "person";
};

function LeadDetailsPage() {
  const { search } = useParams();
  const idOperation = useOperationStore((state) => state.idOperation);
  const [searchParams, setSearchParams] = useState<searchParamsType | null>(
    null
  );
  const [menuItems, setMenuItems] = useState<menuItemType[] | null | undefined>(
    null
  );
  const navigate = useNavigate();

  const idPartner = usePartnerStore((state) => state.partnerId)

  const title = idPartner === "39" ? "questionário de risco" : "proposta"

  useEffect(() => {
    try {
      const searchDecrypted = decrypt(decodeURIComponent(search ?? ""));
      const paramsObj = JSON.parse(searchDecrypted);
      if (!("id" in paramsObj) || !("type" in paramsObj)) {
        throw new Error("Invalid search parameter");
      }
      setSearchParams(paramsObj);
    } catch {
      navigate("/notfound");
    }
  }, [search]);

  const { data, isSuccess, isError, error, isLoading, isRefetching, refetch } =
    useQuery<any>({
      queryKey: [
        "fetchLeadDetailsById",
        searchParams?.id,
        searchParams?.type,
        idOperation,

      ],
      queryFn: () =>
        fetchLeadDetailsById({
          id: searchParams?.id,
          type: searchParams?.type,
          idOperation,
        }),
        
        
            select: (data) => {
        if (data?.nrCEP != null && !isNaN(+data.nrCEP)) {
          return {
            ...data,
            nrCEP: String(data.nrCEP).padStart(8, "0"),
          };
        }


        return data;
      },

      enabled: !!searchParams?.id && !!searchParams?.type && !!idOperation,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
    });

  const {data: bankdata, isFetched: isBankFetched, refetch: refetchBankData, isRefetching: refetchingBankData} = useQuery({
  queryKey: [
    "DadosBancarios",
    searchParams?.id,
    searchParams?.type,
  ],
  queryFn: () =>
    DadosBancarios({
      id: searchParams?.id,
      type: searchParams?.type,
    }),
  enabled: !!searchParams?.id && !!searchParams?.type,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: 0, 
});
  useEffect(() => {
    if (isSuccess && data &&
    (
      searchParams?.type === "person" ||
      (searchParams?.type === "enterprise" && isBankFetched)
    )) {
      setMenuItems([
        {
          id: 1,
          name: "Dados gerais",
          icon: Folder,
          active: true,
          component:
            searchParams?.type === "enterprise" ? (
              <DadosGeraisTab
                typeLead="enterprise"
                data={data}
                bankdata={bankdata}
                refetchLeadData={() => refetch()}
                refetchBankData={() => refetchBankData()}
              />
            ) : (
              <DadosGeraisTab
                typeLead="person"
                data={data}
                refetchLeadData={() => refetch()}
              />
            ),
        },
        {
          id: 2,
          name:
            searchParams?.type === "enterprise" ? "Representantes" : "Contatos",
          icon: User,
          active: false,
          component:
            searchParams?.type === "enterprise" ? (
              <ContatoEnterpriseTab id={searchParams?.id} />
            ) : (
              <ContatoTab id={searchParams?.id} />
            ),
        },
        {
          id: 3,
          name: "Interesses",
          icon: Star,
          active: false,
          component: (
            <InteresseTab
              userType={searchParams?.type}
              idEmpresaOperacao={data.idEmpresaOperacao}
            />
          ),
        },
        {
          id: 4,
          name: title,
          icon: FileText,
          active: false,
          component: <PropostaTab cliData={data} type={searchParams?.type} />,
        },
        {
          id: 5,
          name: "Históricos",
          icon: BookOpen,
          active: false,
          component: <HistoricoTab cliData={data} type={searchParams?.type} />,
        },
        {
          id: 6,
          name: "Canais",
          icon: AtSign,
          active: false,
          component: <CanaisTab />,
        },
        {
          id: 7,
          name: "Produtos",
          icon: Package2,
          active: false,
          component: <ProductTab id={searchParams?.id} type={searchParams?.type}/>,
        },
        {
          id: 8,
          name: "Anotações",
          icon: NotebookPen,
          active: false,
          component: <AnotacaoTab />,
        },
       ...(searchParams?.type === "enterprise"
    ? [
        {
          id: 9,
          name: "Novos colaboradores",
          icon: UserRoundPen,
          active: false,
          component: <CadastroDeColaborador
          idEmpresaOperacao={data.idEmpresaOperacao}
          />,
        },
      ]
    : []),
    ])
    }
  }, [isSuccess, searchParams, isRefetching, isBankFetched, refetchingBankData, searchParams?.type]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
    }
  }, [isError]);

  const handleItemClick = (itemId: number) => {
    const updatedMenuItems = menuItems?.map((item) => ({
      ...item,
      active: item.id === itemId,
    }));
    setMenuItems(updatedMenuItems);
  };

  const activeComponent =
    menuItems?.find((item) => item.active)?.component || null;

  if (isLoading) {
    return <LeadDetailsPageSkeleton />;
  }

  return (
    <LeadContext.Provider value={searchParams?.id ?? null}>
      <div className="flex h-full relative">
        {data && menuItems && (
          <SidebarLead menuItems={menuItems} handleItemClick={handleItemClick} />
        )}

        {data ? (
          <ScrollArea className="flex-1 pr-6 h-full ml-60">
            <div className="flex justify-between items-start pt-6">
              {data && searchParams && (
                <PerfilHeader data={data} type={searchParams.type} />
              )}
            </div>

            <div className="w-full h-fit mt-10 pb-6">
              {activeComponent}
            </div>
          </ScrollArea>
        ) : (
          <IdNotFound />
        )}
      </div>
    </LeadContext.Provider>
  );
}

export default LeadDetailsPage;
