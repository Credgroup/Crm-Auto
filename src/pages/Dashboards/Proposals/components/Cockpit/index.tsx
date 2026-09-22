import { cn } from "@/lib/utils";
import BigNumber from "@/pages/Dashboards/components/BigNumber";
import { Filters } from "../../index";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { execApi } from "@/hooks/useApi";
import DashboardCard from "@/pages/Dashboards/components/DashboardCard";
import DashboardCardErrorBoudary from "@/pages/Dashboards/components/DashboardCardErrorBoudary";
import { CalendarIcon, TrendingUpIcon } from "lucide-react";
import { usePartnerStore } from "@/store/partnerStore";
import CockpitExpandedDialog from "../CockpitExpandedDialog";

type CockpitProps = {
  filters?: Filters;
  className?: string;
}

export default function Cockpit({filters, className}: Readonly<CockpitProps>) {

    const partnerId = usePartnerStore((state) => state.partnerId);

    // Verifica se os filtros necessários estão preenchidos
    const hasValidFilters = filters?.idsOperacoes && 
                           filters.idsOperacoes.length > 0 && 
                           !!filters.dataInicio && 
                           !!filters.dataFim;

    const { data, isSuccess, isError, error, isLoading, isRefetching } = useQuery({
      queryKey: ["ProposalsCockpit", partnerId, filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes],
      queryFn: () => getProposalsCockpit(filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes),
      enabled: hasValidFilters,
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: false,
      refetchOnMount: false,
      gcTime: 0, // Força garbage collection imediato
    })

    useEffect(()=>{
      if(isSuccess && data){
        console.log(data)
      }
    }, [data, isSuccess])

    useEffect(()=>{
      if(isError && error){
        console.log(error)
      }
    }, [error, isError])

    // Estado inicial - aguardando seleção de filtros
    if (!hasValidFilters) {
      return (
        <div className={cn(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4`, className)}>
          {Array.from({length: 4}).map((_, index) => (
            <DashboardCard key={index}>
              <div className="w-full flex flex-col items-center justify-center text-center">
                <CalendarIcon className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Selecione um período e operações</p>
                <p className="text-sm text-muted-foreground">Para visualizar os dados de propostas</p>
              </div>
            </DashboardCard>
          ))}
        </div>
      )
    }

    return (
      <div className={cn(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4`, className)}>
        
        {/* Loading State */}
        {(isLoading || isRefetching) && (
          Array.from({length: 4}).map((_, index)=>(
            <div key={index} className="h-28 bg-muted animate-pulse rounded-md"></div>
          ))
        )}

        {/* Error State */}
        {isError && !isRefetching && !isLoading && error && (
          <div className="col-span-4">
            <DashboardCard>
              <DashboardCardErrorBoudary error={error} className="w-full" />
            </DashboardCard>    
          </div>
        )}

        {/* Success State with Data */}
        {!isError && !isLoading && data && data.dados && !isRefetching && (
          <>
            <CockpitExpandedDialog
              dataInicio={filters?.dataInicio}
              dataFim={filters?.dataFim}
              idsOperacoes={filters?.idsOperacoes}
              endpointUrl="api/crm/dashboard/proposals/all"
            >
              <BigNumber title="Total" value={data.dados.qtdTotalPropostas.toString()} color="#35B43D" />
            </CockpitExpandedDialog>
            <CockpitExpandedDialog
              dataInicio={filters?.dataInicio}
              dataFim={filters?.dataFim}
              idsOperacoes={filters?.idsOperacoes}
              endpointUrl="api/crm/dashboard/proposals/approved"
            >
              <BigNumber title="Aprovadas" value={data.dados.qtdPropostasAprovada.toString()} color="#2A79BA" />
            </CockpitExpandedDialog>
            <CockpitExpandedDialog
              dataInicio={filters?.dataInicio}
              dataFim={filters?.dataFim}
              idsOperacoes={filters?.idsOperacoes}
              endpointUrl="api/crm/dashboard/proposals/responded"
            >
              
              <BigNumber title="Respondidas" value={data.dados.qtdPropostasRespondidas.toString()} color="#CC0000" />
            </CockpitExpandedDialog>
            <CockpitExpandedDialog
              dataInicio={filters?.dataInicio}
              dataFim={filters?.dataFim}
              idsOperacoes={filters?.idsOperacoes}
              endpointUrl="api/crm/dashboard/proposals/closed"
            >
              <BigNumber title="Encerradas" value={data.dados.qtdPropostasEncerradas.toString()} color="#D09433" />
            </CockpitExpandedDialog>
          </>
        )}

        {/* Empty State */}
        {!isError && !isLoading && data && (!data.dados || Object.values(data.dados).every(val => val === 0)) && !isRefetching && (
          <div className="col-span-4">
            <DashboardCard>
              <div className="p-8 w-full flex flex-col items-center justify-center text-center">
                <TrendingUpIcon className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Nenhum dado encontrado</p>
                <p className="text-sm text-muted-foreground">Não há vendas registradas para o período selecionado</p>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    );
}

export interface GetProposalsCockpitResponse {
  sucesso: boolean;
  traceId: string;
  dados: Dados;
  mensagem: string;
}

export interface Dados {
  qtdTotalPropostas: number;
  qtdPropostasRespondidas: number;
  qtdPropostasAprovada: number;
  qtdPropostasEncerradas: number;
  idOperacao: number[];
  dataInicio: string;
  dataFim: string;
  dataConsulta: string;
}

async function getProposalsCockpit(dataInicio?: string, dataFim?: string, idsOperacoes?: string[]){
  try {
    console.log(dataInicio, dataFim, idsOperacoes)
    if(!dataInicio || !dataFim || !idsOperacoes || idsOperacoes.length === 0){
      throw new Error("Data inicio, data fim e ids operacoes são obrigatórios")
    }

    const res: any = await execApi({
      url: "api/crm/dashboard/proposals",
      method: "POST",
      data: {
        dataInicio,
        dataFim,
        idOperacao: idsOperacoes
      },
      isCrmApi: true
    })

    console.log(res)

    if(!res || res.status !== 200){
      throw new Error(res.data.mensagem)
    }

    return res.data as GetProposalsCockpitResponse

  } catch(error: any){
    console.log(error)
    throw new Error(error.message)
  }
}