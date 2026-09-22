import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { execApi } from "@/hooks/useApi";
import { copyToClipboard } from "@/lib/utils";
import JsonEnvioRetornoModal from "@/pages/LeadDetailsPage/components/ProductTab/MoreProductModal/components/JsonEnvioRetornoModal";
import { TransacaoProdutoItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { LuCopy } from "react-icons/lu";

type TransacoesProdutoTabProps = {
    idSeguro?: number | string | null;
}

const columnsTransacoes: ColumnDef<TransacaoProdutoItem>[] = [
    {
        accessorKey: "idSeguroTransacao",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => {
            const idOriginal = row.original.idSeguroTransacao;
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
        accessorKey: "dsMovimento",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Evento" />
        ),
    },
    {
        accessorKey: "dtEnvio",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data evento" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            if(item.dtEnvio) {
                return <p>{format(new Date(item.dtEnvio), "dd/MM/yyyy HH:mm")}</p>
            }
            return <p>--</p>
        }
    },
    {
        accessorKey: "dsProcessoStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status processo" />
        )
    },
    {
        accessorKey: "",
        id: "envioRetorno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Envio/Retorno" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            return (
                <JsonEnvioRetornoModal jsonEnvio={item.jsonEnvio} jsonRetorno={item.jsonRetorno} />
            )
        }
    }
]

const pageSize = 6;

export default function TransacoesProdutoTab({ idSeguro }: Readonly<TransacoesProdutoTabProps>) {
    const [pageIndex, setPageIndex] = useState(0);


    const { data, isFetching, isRefetching, isLoading } = useQuery({
        queryKey: ["transacoesProduto", idSeguro, pageIndex],
        queryFn: () => getTransacoesProduto({ idSeguro, pageNumber: pageIndex + 1, pageSize }),
        enabled: !!idSeguro,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 0,
    })
    
    return (
        <>
            <div className="flex items-center space-x-2 mb-8">
                <p className="font-medium text-xl">Transações do Produto</p>
            </div>
            <div className="w-full flex-1 pr-4">
                <DataTable
                    columns={columnsTransacoes}
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
    )
}

type GetTransacoesProdutoProp = {
    idSeguro?: number | string | null;
    pageNumber: number;
    pageSize: number;
}

type TransacoesProdutoResponse = {
    items: TransacaoProdutoItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

async function getTransacoesProduto({ idSeguro, pageNumber, pageSize }: Readonly<GetTransacoesProdutoProp>) {
    if(!idSeguro) {
        throw new Error("Id seguro não informado")
    }
    
    const res = await execApi({
        url: `api/crm/insurance/find/transaction/${idSeguro}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
        data: {},
        isCrmApi: true
    })

    if(res.status !== 200) {
        throw new Error("Erro ao buscar transações do seguro")
    }

    return res.data as TransacoesProdutoResponse
}