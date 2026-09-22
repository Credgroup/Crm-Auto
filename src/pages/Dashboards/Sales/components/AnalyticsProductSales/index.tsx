import { CardTitle, CardHeader } from "@/components/ui/card";
import DashboardCard from "@/pages/Dashboards/components/DashboardCard";
import AvatarCard from "@/components/AvatarCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AlertCircleIcon, CalendarIcon } from "lucide-react";
import { execApi } from "@/hooks/useApi";
import { type Filters } from "../..";
import { cn, handleExtractDataToFileCSV } from "@/lib/utils";
import DashboardCardErrorBoudary from "@/pages/Dashboards/components/DashboardCardErrorBoudary";
import { usePartnerStore } from "@/store/partnerStore";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { LuExternalLink } from "react-icons/lu";

type AnalyticsProductSalesProps = {
    filters?: Filters;
    className?: string;
}

export default function AnalyticsProductSales({filters, className}: Readonly<AnalyticsProductSalesProps>) {

    const partnerId = usePartnerStore((state) => state.partnerId);

    // Verifica se os filtros necessários estão preenchidos
    const hasValidFilters = filters?.idsOperacoes && 
                           filters.idsOperacoes.length > 0 && 
                           !!filters.dataInicio && 
                           !!filters.dataFim;

    const { data, isSuccess, isError, error, isLoading, isRefetching } = useQuery({
        queryKey: ["AnalyticsProductSales", partnerId, filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes],
        queryFn: () => getAnalyticsProductSales(filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes),
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
            <DashboardCard className={cn("p-0 flex flex-col justify-between", className)}>
                <CardHeader className="py-3 px-4 mb-4 flex flex-row items-center justify-between h-16">
                    <CardTitle className="text-lg font-bold">
                        Produto X Vendas
                    </CardTitle>
                </CardHeader>
                <div className="p-8 w-full flex flex-col items-center justify-center text-center">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Selecione um período e operações</p>
                    <p className="text-sm text-muted-foreground">Para visualizar os dados de vendas por produto</p>
                </div>
            </DashboardCard>
        )
    }

    return (
        <DashboardCard className={cn("p-0 flex flex-col justify-between", className)}>
            <CardHeader className="py-3 px-4 mb-4 flex flex-row items-center justify-between h-16">
                <CardTitle className="text-lg font-bold">
                    Produto X Vendas
                </CardTitle>
                {
                    !isError && !isLoading && data && data.dados.length > 0 && !isRefetching && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={()=>handleExtractDataToFileCSV(data?.dados ?? [], "produtoXvendas")}
                                    variant="outline"
                                    size="icon"
                                    className="aspect-square w-7 h-7"
                                >
                                    <LuExternalLink />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Extrair para CSV
                            </TooltipContent>
                        </Tooltip>
                    )
                }
            </CardHeader>

            {/* Loading State */}
            {(isLoading || isRefetching) && (
                <div className="p-3">
                    {Array.from({length: 3}).map((_, index) => (
                        <div className="w-full flex flex-row items-center justify-between mb-6" key={index}>
                            <div className="flex items-center gap-2 flex-row">
                                <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-28 h-4 bg-muted rounded-sm animate-pulse"></div>
                                    <div className="w-20 h-4 bg-muted rounded-sm animate-pulse"></div>
                                </div>
                            </div>
                            <div className="w-20 h-4 bg-muted rounded-md animate-pulse"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {isError && !isRefetching && !isLoading && error && (
                <div className="w-full p-4 h-full">
                    <DashboardCardErrorBoudary error={error} className="w-full" />
                </div>
            )}

            {/* Success State with Data */}
            {!isError && !isLoading && data && data.dados.length > 0 && !isRefetching && (
                <>
                    <div className="px-4 grid grid-cols-6 gap-3 text-xs font-semibold mb-2 text-muted-foreground uppercase">
                        <span className="col-span-3">Produto</span>
                        <span className="col-span-1">Quantidade</span>
                        <span className="col-span-2 text-right">Valor</span>
                    </div>
                    <ScrollArea className="h-[400px] p-3">
                        {data.dados.map((dado) => (
                            <div className="grid grid-cols-6 items-center gap-3 justify-between hover:bg-muted p-2 rounded-md transition-colors mb-2" key={dado.nmProduto}>
                                <div className="col-span-3">
                                    <HoverCard>
                                        <HoverCardTrigger className="group">
                                            <AvatarCard title={dado.nmProduto} subtitle={dado.nmProduto} avatarImageStyle="square" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-fit max-w-96">
                                            <AvatarCard title={dado.nmProduto} subtitle={dado.nmProduto} avatarImageStyle="square" abbreviateContent={false} avatarAlign="top" />
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <span className="text-sm font-bold col-span-1">{dado.qtdTotalVendas}</span>
                                <span className="text-sm font-bold col-span-2 text-right">{dado.vlTotalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        ))}
                    </ScrollArea>
                </>
            )}

            {/* Empty State */}
            {!isError && !isLoading && data && data.dados.length === 0 && !isRefetching && (
                <div className="p-8 w-full flex flex-col items-center justify-center text-center">
                    <AlertCircleIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Nenhum dado encontrado</p>
                    <p className="text-sm text-muted-foreground">Não há vendas registradas para o período selecionado</p>
                </div>
            )}
        </DashboardCard>
    )
}

interface GetAnalyticsProductSalesResponse {
    sucesso: boolean;
    traceId: string;
    dados: Dado[];
    mensagem: string;
}

interface Dado {
    nmProduto: string;
    qtdTotalVendas: number;
    vlTotalVendas: number;
}

async function getAnalyticsProductSales(dataInicio?: string, dataFim?: string, idsOperacoes?: string[]){
    try {
        if(!dataInicio || !dataFim || !idsOperacoes || idsOperacoes.length === 0){
            throw new Error("Data inicio, data fim e ids operacoes são obrigatórios")
        }

        const res: any = await execApi({
            url: "api/crm/dashboard/sales/product",
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

        return res.data as GetAnalyticsProductSalesResponse

    } catch(error: any){
        console.log(error)
        throw new Error(error.message)
    }
}