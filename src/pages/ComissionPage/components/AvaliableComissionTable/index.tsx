import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { execApi } from "@/hooks/useApi";
import { useOperationStore } from "@/store/operationStore";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { LucideRefreshCcw, Play } from "lucide-react";
import { useEffect, useState } from "react";
import ProccessComissionDialog from "../ProccessComissionDialog";

type ComissionAvaliablePaginate = {
  items: ComissionAvaliable[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

type ComissionAvaliable = {
  idComissao: number;
  idComissaoVersao: number;
  nmComissao: string;
  jsonConfComissao: string;
}

const pageSize = 5;

export default function AvaliableComissionTable() {

    const operationId = useOperationStore(state => state.idOperation)
    const [pageIndex, setPageIndex] = useState(0);

    const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useQuery({
        queryKey: ["avaliableComission", operationId, pageIndex],
        queryFn: async () => {
            if(!operationId){
                throw new Error("Operação não encontrada")
            }
            
            const res: any = await execApi({
                url: `api/crm/commission/find/operation/${operationId}?pageNumber=${pageIndex + 1}&pageSize=${pageSize}`,
                method: "GET",
                data: {},
                isCrmApi: true
            })

            console.log(res)

            if(!res || !res.data){
                throw new Error("Erro ao buscar comissões disponíveis")
            }

            const dataPaginate = res.data as ComissionAvaliablePaginate

            const itemsFormated = processResponse(dataPaginate.items)

            return {
                items: itemsFormated,
                totalCount: dataPaginate.totalCount,
                pageNumber: dataPaginate.pageNumber,
                pageSize: dataPaginate.pageSize
            };
        },
        enabled: !!operationId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchInterval: false,
        retry: 0
    })

    useEffect(()=>{
        if(isSuccess && data){
            console.log(data)
        }
    }, [data, isSuccess])

    useEffect(()=>{
        if(isError && error){
            console.log("Erro ao buscar comissões disponíveis", error)
        }
    }, [isError, error])

    return (
        <div>
            <DataTable
                columns={columns}
                data={data?.items || []}
                filter={[]}
                pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                loading={isLoading || isRefetching}
                error={isError}
                dataTableOptions={
                    <>
                        <Button 
                            variant="ghost" 
                            className="w-full flex items-center justify-start"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                        >
                            <LucideRefreshCcw className={isRefetching ? "animate-spin" : ""}/>
                            Refazer busca
                        </Button>
                    </>
                }
            />
        </div>
    );
}

const columns: ColumnDef<any>[] = [
    {
        accessorKey: "idComissao",
        header: "ID",
    },
    {
        accessorKey: "nmComissao",
        header: "Nome",
    },
    {
        accessorKey: "dsCalculo",
        header: "Tipo",
    },
    {
        accessorKey: "dsPeriodo",
        header: "Período",
    },
    {
        accessorKey: "processar",
        header: "Processar",
        cell: ({ row }) => {
            const comission = row.original
            const isMonthly = comission.tpPeriodo == 208

            if(isMonthly){
                return (
                    <ProccessComissionDialog comission={comission} />
                )
            }

            return (
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon" disabled>
                        <Play />
                    </Button>
                </div>
            )
        }
    }
];

export type ComissionFormated = {
    idComissao?: number;
    nmComissao?: string;
    dsCalculo?: string;
    dsPeriodo?: string;
    tpCalculo?: string;
    tpPeriodo?: string;
    idComissaoVersao?: number;
    dtProcessarDisponiveis?: string[];
}

function processResponse(data: any): ComissionFormated[] {
    try {
        return data.map((item: any) => {
            const jsonConf = JSON.parse(item.jsonConfComissao)
            return {
                idComissao: item.idComissao,
                nmComissao: item.nmComissao,
                tpCalculo: jsonConf.tpCalculo,
                dsCalculo: jsonConf.dsCalculo ?? "--",
                tpPeriodo: jsonConf.tpPeriodo,
                dsPeriodo: jsonConf.dsPeriodo ?? "--",
                idComissaoVersao: item.idComissaoVersao,
                dtProcessarDisponiveis: item.dtProcessarDisponiveis
            } as ComissionFormated
        })
    } catch (error: any) {
        throw new Error("Erro ao processar comissões \n" + error.message)
    }

}
