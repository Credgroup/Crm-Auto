import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { execApi } from "@/hooks/useApi";
import { copyToClipboard } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { HistoricoProdutoItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";

const columnsHistoric: ColumnDef<HistoricoProdutoItem>[] = [
    {
        accessorKey: "idSeguroHistorico",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => {
            const idOriginal = row.original.idSeguroHistorico;
            const idResumed = idOriginal.toString();
            return (
                <HoverCard>
                <HoverCardTrigger>
                    <p className="hover:underline">{idResumed}</p>
                </HoverCardTrigger>
                <HoverCardContent className="flex items-center gap-4 w-fit py-2">
                    <p className="text-sm">{idOriginal}</p>
                    <Button
                    size="icon"
                    className="aspect-square"
                    variant="ghost"
                    onClick={() => copyToClipboard(idOriginal.toString())}
                    >
                        <LuCopy />
                    </Button>
                </HoverCardContent>
                </HoverCard>
            );
        },
    },
    {
        accessorKey: "nmEvento",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Evento" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            if(item.nmEvento) {
                return <p>{item.nmEvento}</p>
            }
            return <p>--</p>
        }
    },
    {
        accessorKey: "dtHistorico",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data evento" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            if(item.dtHistorico) {
                return <p>{format(new Date(item.dtHistorico), "dd/MM/yyyy HH:mm")}</p>
            }
            return <p>--</p>
        }
    },
    {
        accessorKey: "stMovimento",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            return (
                <HoverCard>
                    <HoverCardTrigger className="hover:underline">
                        <p>{item.stMovimento.length > 20 ? item.stMovimento.substring(0, 20) + "..." : item.stMovimento}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        {item.stMovimento}
                    </HoverCardContent>
                </HoverCard>
            )
        }
    }
];
  
const pageSize = 10;

type HistoricoProdutoTabProps = {
    idSeguro?: number | string | null;
}

export default function HistoricoProdutoTab({ idSeguro }: Readonly<HistoricoProdutoTabProps>) {
    const [pageIndex, setPageIndex] = useState(0);
    const idOperation = useOperationStore((state) => state.idOperation);

    console.log("idSeguro", idSeguro)

    const { data, isLoading, isError, error, isFetching, isRefetching, isSuccess } = useQuery({
    queryKey: ["historicoDoProduto", pageIndex, pageSize, idSeguro, idOperation],
    queryFn: () => getHistorico({idToSearch: idSeguro, pageIndex: pageIndex + 1, pageSize }),
    enabled: !!idOperation && !!idSeguro,
    retry: false,
    refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if(isSuccess && data) {
            console.log(data)
        }
    }, [isSuccess, data])

    useEffect(() =>{
        if(isError && error) {
            console.log(error)
        }
    }, [isError, error])
  
    return (
        <>
            <div className="flex items-center space-x-2 mb-8">
                <p className="font-medium text-xl">Histórico do Produto</p>
            </div>
            <div className="w-full flex-1 pr-4">
                <DataTable
                columns={columnsHistoric}
                data={data?.items ?? []}
                error={false}
                filter={["data"]}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
                loading={isFetching ?? isRefetching ?? isLoading}
                />
            </div>
        </>
  );
}

interface HistoricoResponse {
    items: HistoricoProdutoItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
  
type GetHistoricoProps = {
idToSearch?: number | string | null;
pageIndex: number;
pageSize: number;
}

async function getHistorico({ idToSearch, pageIndex, pageSize }: Readonly<GetHistoricoProps>) {
    console.log("tentando buscar histórico")
    if(!idToSearch) {
        throw new Error("idToSearch não foram encontrados");
    }

    const res: any = await execApi({
        url: `api/crm/insurance/find/history/${idToSearch}?pageNumber=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
        data: {},
        isCrmApi: true
    })

    console.log(res)

    if(res.status !== 200) {
        throw new Error("Aconteceu algum erro ao buscar o histórico");
    }

    return res.data as HistoricoResponse;

}