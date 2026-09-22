import { DataTable } from "@/components/DataTable/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { execApi } from "@/hooks/useApi";
import { copyToClipboard } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { ParcelaProdutoItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { LuCopy, LuLock } from "react-icons/lu";
import BaixarParcelaModal from "./BaixarParcelaModal";
import SegundaViaModal from "./SegundaViaModal";
import { useIfUserIsHigherOrIqualsTo } from "@/store/permissionRoleStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const pageSize = 10;

type ParcelasProdutoTabProps = {
    idSeguro?: number | string | null;
}

// const columnsParcelas: ColumnDef<ParcelaProdutoItem>[] = [

const getColumnsParcelas = (
    onSuccess?: () => void
): ColumnDef<ParcelaProdutoItem>[] => [{
    accessorKey: "idSeguroParcela",
    header: "ID",
    cell: ({ row }) => {
        const idOriginal = row.original.idSeguroParcela;
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
    }
},
{
    accessorKey: "nrParcela",
    header: "Parcela",
},
{
    accessorKey: "vlParcela",
    header: "Valor da parcela",
    cell: ({ row }) => {
        const value = row.original.vlParcela
        return <p>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
    }
},
{
    accessorKey: "vlCobrado",
    header: "Valor cobrado",
    cell: ({ row }) => {
        const value = row.original.vlCobrado
        return <p>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
    }
},
{
    accessorKey: "dsStatusParcela",
    header: "Status da parcela",
    cell: ({ row }) => {
        const status = row.original.chStatusParcela
        return <StatusBadge nmDominio="cdStatusParcela" cdStatus={Number(status)} />
    }
},
{
    accessorKey: "dtEnvio",
    header: "Data de envio",
    cell: ({ row }) => {
        const date = row.original.dtEnvio
        if (!date) {
            return <p>--</p>
        }
        return <p>{format(new Date(date), "dd/MM/yyyy HH:mm")}</p>
    }
},
{
    accessorKey: "dtPagamento",
    header: "Data de pagamento",
    cell: ({ row }) => {
        const date = row.original.dtPagamento
        if (!date) {
            return <p>--</p>
        }
        return <p>{format(new Date(date), "dd/MM/yyyy  HH:mm")}</p>
    }
},
{
    accessorKey: "dtCorte",
    header: "Data de corte",
    cell: ({ row }) => {
        const date = row.original.dtCorte
        if (!date) {
            return <p>--</p>
        }
        return <p>{format(new Date(date), "dd/MM/yyyy HH:mm")}</p>
    }
},
{
    accessorKey: "dtVencimento",
    header: "Data de vencimento",
    cell: ({ row }) => {
        const date = row.original.dtVencimento
        if (!date) {
            return <p>--</p>
        }
        return <p>{format(new Date(date), "dd/MM/yyyy HH:mm")}</p>
    }
},
{
    accessorKey: "baixaParcela",
    header: "Baixa manual",
    cell: ({ row }) => {
        const parcela = row.original.idSeguroParcela;
        const status = row.original.cdStatusParcela;
        const canViewButton = useIfUserIsHigherOrIqualsTo({
            roleName: "Administrador"
        })


        if (canViewButton) {
            return (
                <div className="flex w-full justify-start pl-[5%]">
                    <BaixarParcelaModal
                        idParcela={parcela}
                        onSuccess={onSuccess}
                        disabled={status !== 1247}
                    />
                </div>
            );
        }

        return (
            <Tooltip>
                <TooltipTrigger>
                    <LuLock className="dark:text-zinc-600 text-zinc-500" />
                </TooltipTrigger>
                <TooltipContent>
                    Seu usuário não tem permissão
                </TooltipContent>
            </Tooltip>
        )
    }
},
{
    accessorKey: "segundaVia",
    header: "Cobrança manual",
    cell: ({ row }) => {
        const parcela = row.original.idSeguroParcela;
        const isActive = row.original.tpSegundaVia === 20968 && (row.original.cdStatusParcela === 1247 || row.original.cdStatusParcela === 478);

        return (
            <div className="flex w-full justify-start pl-[5%]">
                <SegundaViaModal
                    idParcela={parcela}
                    disabled={!isActive}
                    onSuccess={onSuccess}
                />
            </div>
        );
    }
}
    ]

export default function ParcelasProdutoTab({ idSeguro }: Readonly<ParcelasProdutoTabProps>) {

    const [pageIndex, setPageIndex] = useState(0);
    const idOperation = useOperationStore((state) => state.idOperation);


    const { data, isLoading, isError, error, isFetching, isRefetching, isSuccess, refetch } = useQuery({
        queryKey: ["parcelasDoProduto", pageIndex, pageSize, idSeguro, idOperation],
        queryFn: () => getParcelas({ idToSearch: idSeguro, pageIndex: pageIndex + 1, pageSize }),
        enabled: !!idOperation && !!idSeguro,
        retry: false,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (isSuccess && data) {
            console.log(data)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (isError && error) {
            console.log(error)
        }
    }, [isError, error])

    const columns = getColumnsParcelas(refetch);

    return (
        <>
            <div className="flex items-center space-x-2 mb-8">
                <p className="font-medium text-xl">Parcelas do Produto</p>
            </div>
            <div className="w-full flex-1 pr-4">
                <DataTable
                    columns={columns}
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


type GetParcelasProps = {
    idToSearch?: number | string | null;
    pageIndex: number;
    pageSize: number;
}

type ParcelasProdutoResponse = {
    items: ParcelaProdutoItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

async function getParcelas({ idToSearch, pageIndex, pageSize }: Readonly<GetParcelasProps>) {
    if (!idToSearch) {
        throw new Error("Id seguro não informado")
    }

    const res: any = await execApi({
        url: `api/crm/insurance/find/installment/${idToSearch}?pageNumber=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
        data: {},
        isCrmApi: true
    })

    if (res.status !== 200) {
        throw new Error("Erro ao buscar parcelas do produto")
    }

    return res.data as ParcelasProdutoResponse


}