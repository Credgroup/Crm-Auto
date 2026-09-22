import { type Filters } from "./../../";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { AnaliticsRecentSalesType, columns } from "./column";
import { cn, handleExtractDataToFileCSV } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { execApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import useDominios from "@/hooks/useDominios";
import { Dominio } from "@/types";
import { usePartnerStore } from "@/store/partnerStore";
import DashboardCard from "@/pages/Dashboards/components/DashboardCard";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LuExternalLink } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RecentSalesProps = {
    filters?: Filters;
    className?: string;
}

interface Tag extends Dominio {
    isActive: boolean;
}

const pageSize = 10
export default function RecentSales({filters, className}: Readonly<RecentSalesProps>) {

    const partnerId = usePartnerStore((state) => state.partnerId);
    const [_, setTags] = useState<Tag[]>([])
    const [pageIndex, setPageIndex] = useState(0)
    const [tpBusca, setTpBusca] = useState<"empresa" | "pessoa">("empresa")
    // const [selectedTagHidden, setSelectedTagHidden] = useState<boolean>(false)
    
    // Verifica se os filtros necessários estão preenchidos
    const hasValidFilters = filters?.idsOperacoes && 
    filters.idsOperacoes.length > 0 && 
    !!filters.dataInicio && 
    !!filters.dataFim;

    const { data, isSuccess, isError, error, isLoading, isRefetching } = useQuery({
        queryKey: ["RecentSalesData", partnerId, filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes, pageIndex, tpBusca],
        queryFn: () => getSalesRecent({dataInicio: filters?.dataInicio, dataFim: filters?.dataFim, idsOperacoes: filters?.idsOperacoes, pageNumber: pageIndex + 1, pageSize: pageSize, tpBusca}),
        enabled: hasValidFilters,
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: false,
        refetchOnMount: false,
        gcTime: 0, // Força garbage collection imediato
    })

    const {data: dataDominios, isSuccess: isSuccessDominios} = useDominios({nmDominio: ["cdStatusSeguro"]})

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

    useEffect(()=>{
        if(isSuccessDominios && dataDominios){
            const tags = dataDominios[0].map((item: Dominio)=>({...item, isActive: false}) as Tag)
            setTags(tags)
        }
    }, [dataDominios, isSuccessDominios])

    return (
        <DashboardCard className={cn("pt-3", className)}>
            <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">
                    Vendas Recentes
                </CardTitle>

                <div className="flex items-center gap-2">
                    <Select value={tpBusca} onValueChange={(value)=>setTpBusca(value as "empresa" | "pessoa")}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Tipo de busca" />
                        </SelectTrigger>
                        <SelectContent className="  w-fit">
                            <SelectItem value="empresa">Empresa</SelectItem>
                            <SelectItem value="pessoa">Pessoa</SelectItem>
                        </SelectContent>
                    </Select>

                    {
                        !isError && !isLoading && data && data?.dados?.items.length > 0 && !isRefetching && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={()=>handleExtractDataToFileCSV(data?.dados?.items ?? [], "vendasrecentes")}
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
                </div>
            </CardHeader>

            <div className="relative">
                <DataTable 
                    className="min-w-full"
                    columns={columns}
                    data={data?.dados?.items ?? []}
                    pageCount={Math.ceil((data?.dados?.totalCount ?? 0) / pageSize)}
                    pageIndex={pageIndex}
                    onPageChange={setPageIndex}
                    error={isError}
                    loading={isLoading}
                    dataTableOptions={
                        <>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="z-10 w-full justify-start">
                                        <Expand />
                                        Expandir tabela
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-[95vw] h-full max-h-[95vh]">
                                    <DialogHeader className="hidden">
                                        <DialogTitle>
                                            teste
                                        </DialogTitle>
                                        <DialogDescription>
                                            teste
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DataTable 
                                        columns={columns}
                                        data={data?.dados?.items ?? []}
                                        pageCount={Math.ceil((data?.dados?.totalCount ?? 0) / pageSize)}
                                        pageIndex={pageIndex}
                                        onPageChange={setPageIndex}
                                        error={isError}
                                        loading={isLoading || isRefetching}
                                    />
                                </DialogContent>
                            </Dialog>
                        </>
                    }
                />
            </div>
        </DashboardCard>
    )   
}

export interface getSalesRecentResponse {
    sucesso: boolean;
    traceId: string;
    dados: {
        items: AnaliticsRecentSalesType[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
    };
    mensagem: string;
  }

  type GetSalesRecentProps = {
    dataInicio?: string;
    dataFim?: string;
    idsOperacoes?: string[];
    pageNumber?: number;
    pageSize?: number;
    tpBusca?: "empresa" | "pessoa"
  }
  
  async function getSalesRecent({dataInicio, dataFim, idsOperacoes, pageNumber, pageSize, tpBusca}: Readonly<GetSalesRecentProps>){
    try {
      console.log(dataInicio, dataFim, idsOperacoes)
      if(!dataInicio || !dataFim || !idsOperacoes || idsOperacoes.length === 0 || !pageSize){
        throw new Error("Data inicio, data fim e ids operacoes são obrigatórios")
      }

      let varTpBusca = "empresa"
      if(tpBusca === "pessoa"){
        varTpBusca = "pessoa"
      }
  
      const res: any = await execApi({
        url: "api/crm/dashboard/sales/latest",
        method: "POST",
        data: {
          dataInicio,
          dataFim,
          idOperacao: idsOperacoes,
          pageNumber,
          pageSize,
          tpBusca: varTpBusca
        },
        isCrmApi: true
      })
  
      console.log(res)
  
      if(!res || res.status !== 200){
        throw new Error(res.data.mensagem)
      }
  
      return res.data as getSalesRecentResponse
  
    } catch(error: any){
      console.log(error)
      throw new Error(error.message)
    }
  }