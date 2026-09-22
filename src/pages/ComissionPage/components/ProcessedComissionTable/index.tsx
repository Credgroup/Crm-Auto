import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { execApi } from "@/hooks/useApi";
import { useOperationStore } from "@/store/operationStore";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { LucideRefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import ProcessedComissionDetailsModal from "../ProcessedComissionDetailsModal";

const pageSize = 5;

export default function ProcessedComissionTable() {

    const [pageIndex, setPageIndex] = useState(0);

    const operationId = useOperationStore(state => state.idOperation)

    const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useQuery({
        queryKey: ["processedComission", operationId, pageIndex],
        queryFn: async () => {
            if(!operationId){
                throw new Error("Operação não encontrada")
            }
            
            const res: any = await execApi({
                url: `api/crm/commission/find/process/operation/${operationId}?pageNumber=${pageIndex + 1}&pageSize=${pageSize}`,
                method: "GET",
                data: {},
                isCrmApi: true
            })

            console.log(res)

            if(!res){
                throw new Error("Erro ao buscar comissões processadas")
            }

            return res.data as ComissionProcessedPaginate
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
            console.log("Erro ao buscar comissões processadas", error)
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

const columns: ColumnDef<ComissionProcessed>[] = [
    {
        accessorKey: "idMovComissao",
        header: "ID Mov",
    },
    {
        accessorKey: "idComissao",
        header: "ID Comissão",
    },
    {
        accessorKey: "nmComissao",
        header: "Nome",
        cell: ({row}) => {
            const data = row.original
            return (
                <div>
                    <p>{data.nmComissao ?? "--"}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "vlBaseTotal",
        header: "Valor Base",
        cell: ({row}) => {
            const data = row.original
            return (
                <div>
                    <p>{data.vlBaseTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? "--"}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "vlComissaoTotal",
        header: "Valor Comissão",
        cell: ({row}) => {
            const data = row.original
            return (
                <div>
                    <p>{data.vlComissaoTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? "--"}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "dsStatusComissao",
        header: "Status",
        cell: ({row}) => {
            const data = row.original
            return (
                <div>
                    <p>{data.dsStatusComissao ?? "--"}</p>
                </div>
            )
        }
    },
    {
        header: "Detalhes",
        cell: ({row}) => {
            const data = row.original
            return (
                <ProcessedComissionDetailsModal comission={data} />
            )
        }
    }
];

export type ComissionProcessedPaginate = {
    items: ComissionProcessed[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export type ComissionProcessed = {
  idMovComissao: number;
  idComissao: number;
  idComissaoVersao: number;
  idOperacao: number;
  vlBaseTotal: number;
  vlComissaoTotal: number;
  idUsuario: number;
  dtVigenciaInicio: string;
  dtVigenciaFim: string;
  tpStatusComissao: number;
  dsStatusComissao: string;
  dtCadastro: string;
  dtAlteracao: string;
  nmComissao: string;
}