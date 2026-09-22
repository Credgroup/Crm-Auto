import { DataTable } from "@/components/DataTable/DataTable";

import columnsCockpitExpanded, { CockpitExpandedData } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { dev_log } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const pageSize = 10

interface CockpitExpandedDataResponse {
  sucesso: boolean;
  traceId: string;
  dados: DBData;
  mensagem: string;
}

interface DBData {
  items: CockpitExpandedData[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface TableProps {
  dataInicio?: string;
  dataFim?: string;
  idsOperacoes?: string[];
  endpointUrl: string;
}

export default function Table({ dataInicio, dataFim, idsOperacoes, endpointUrl }: Readonly<TableProps>){
    const [pageIndex, setPageIndex] = useState(0)
    
    // Verifica se os parâmetros necessários estão preenchidos
    const hasValidParams = Boolean(dataInicio && dataFim && idsOperacoes && idsOperacoes.length > 0);

    const { data, isSuccess, isError, isLoading, error } = useQuery({
        queryKey: ["getCockpitExpandedData", endpointUrl, dataInicio, dataFim, idsOperacoes],
        queryFn: async () =>{


            if (!hasValidParams) {
                throw new Error("Parâmetros obrigatórios não fornecidos");
            }

            const res: any = await execApi({
                url: endpointUrl,
                method: "POST",
                data: {
                    idOperacao: idsOperacoes,
                    dataInicio,
                    dataFim
                },
                isCrmApi: true
            })

            dev_log(()=>console.log(res))

            if(!res.data.sucesso){
                throw new Error("Algum erro aconteceu ao buscar analítico \n\n" + res.data.mensagem)
            }

            return res.data as CockpitExpandedDataResponse
        },
        enabled: hasValidParams,
        refetchOnWindowFocus: false,
        retry: 0
    })

    useEffect(()=>{
        if(isSuccess && data){
            dev_log(()=>console.log(data))
        }
    }, [isSuccess, data])
    
    useEffect(()=>{
        if(isError && error){
            dev_log(()=>console.log(error))
            toast.error(error.message)
        }
    }, [isError, error])
    return (
        <DataTable 
            columns={columnsCockpitExpanded}
            data={data?.dados?.items ?? []}
            pageCount={Math.ceil((data?.dados?.totalCount ?? 0) / pageSize)}
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
            error={isError}
            loading={isLoading}
            className="w-full"
        />
    )
}