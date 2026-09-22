import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { useOperationStore } from "@/store/operationStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePartnerStore } from "@/store/partnerStore";


interface OverviewData {
  sucesso: boolean;
  traceId: string;
  dados: Dados;
  mensagem: string;
}

interface Dados {
  qtdSegurosAtivos: number;
  qtdSegurosCancelados: number;
  qtdSegurosPreVenda: number;
  qtdSeguroAdesaoRejeitada: number;
  idOperacao: number;
  dataInicio: string;
  dataFim: string;
  dataConsulta: string;
}

type GetOverviewDataProps = {idOperation: string | null, dataInicio: string, dataFim: string}

async function getOverviewData({idOperation, dataInicio, dataFim}: Readonly<GetOverviewDataProps>) {
  
  if(!idOperation || !dataInicio || !dataFim) {
    throw new Error("idOperation, dataInicio e dataFim são obrigatórios")
  }

  const res: any = await execApi({
    url: "api/crm/dashboard/insurance",
    method: "POST",
    isCrmApi: true,
    data: {
      idOperacao: idOperation,
      dataInicio: `${dataInicio}T00:00:00`,
      dataFim: `${dataFim}T23:59:59`,
    },
  })

  if(!res.data.sucesso){
    throw new Error(res.data.mensagem)
  }

  return res.data as OverviewData
}

export default function OverviewPage() {
  const idOperation = useOperationStore((state) => state.idOperation)
  const partnerId = usePartnerStore((state) => state.partnerId)

  const {data: overviewData, isLoading, isError, error, isSuccess, refetch, isRefetching} = useQuery({
    queryKey: ["overviewData", idOperation, partnerId], 
    queryFn: () => {
      const dataInicio = format(new Date(), "yyyy-MM-dd")
      const dataFim = format(new Date(), "yyyy-MM-dd")
      return getOverviewData({idOperation, dataInicio, dataFim})
    },
    refetchInterval: 1000 * 60 * 60 * 5,
    enabled: !!idOperation,
    retry: 3
  })

  useEffect(() =>{
    if(isSuccess && overviewData){
      console.log(overviewData)
    }
  }, [overviewData, isSuccess])

  useEffect(() =>{
    if(isError){
      console.error(error)
    }
  }, [isError, error])


  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => refetch()} className="aspect-square" size="icon" variant="outline"><RefreshCcw className={`${(isRefetching || isLoading) ? "animate-spin" : ""}`}/></Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar dados</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-xl text-zinc-700 dark:text-zinc-400">{format(new Date(), "dd/MM/yyyy")} até {format(new Date(), "dd/MM/yyyy")} às 23:59</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold mt-6 mb-4">Overview</h1>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Vendas totais</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {
              (isRefetching || isLoading) && (
                <div className="w-full h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
              ) 
            }
            {
              overviewData && overviewData.dados && isSuccess && !isRefetching && !isLoading && (
                <span className="text-3xl font-bold">{overviewData.dados.qtdSegurosAtivos}</span>
              )
            }

            {
              isError && (
                <span className="text-red-500">{error?.message}</span>
              )
            } 
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Pré-venda</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
          {
              (isRefetching || isLoading) && (
                <div className="w-full h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
              ) 
            }
            {
              overviewData && overviewData.dados && isSuccess && !isRefetching && !isLoading && (
                <span className="text-3xl font-bold">{overviewData.dados.qtdSegurosPreVenda}</span>
              )
            }

            {
              isError && (
                <span className="text-red-500">{error?.message}</span>
              )
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Vendas cancelados</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
          {
              (isRefetching || isLoading) && (
                <div className="w-full h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
              ) 
            }
            {
              overviewData && overviewData.dados && isSuccess && !isRefetching && !isLoading && (
                <span className="text-3xl font-bold">{overviewData.dados.qtdSegurosCancelados}</span>
              )
            }

            {
              isError && (
                <span className="text-red-500">{error?.message}</span>
              )
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Vendas rejeitadas</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
          {
              (isRefetching || isLoading) && (
                <div className="w-full h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
              ) 
            }
            {
              overviewData && overviewData.dados && isSuccess && !isRefetching && !isLoading && (
                <span className="text-3xl font-bold">{overviewData.dados.qtdSeguroAdesaoRejeitada}</span>
              )
            }

            {
              isError && (
                <span className="text-red-500">{error?.message}</span>
              )
            }
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}