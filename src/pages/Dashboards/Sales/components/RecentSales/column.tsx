import AvatarCard from "@/components/AvatarCard";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { dev_log, formatValue } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Building2, User } from "lucide-react";

export interface AnaliticsRecentSalesType {
  idSeguro: number;
  nmCliente: string;
  nrDocumento: string;
  tpCliente: string;
  idOperacao: number;
  idProduto: number;
  nmProduto: string;
  cdStatusSeguro: number;
  chStatusSeguro: string;
  dsStatusSeguro: string;
  dtEmissao: string;
  vlPremio: number;
  idUsuario: number;
  nmUsuario: string;
  dtCadastro: string;
  dtCancelamento: string;
  tpCancelamento: string;
}

export const columns: ColumnDef<AnaliticsRecentSalesType>[] = [
    {
        header: "Cliente",
        accessorKey: "nmCliente",
        cell: ({row}) => {
            const tpCliente = row.original.tpCliente
            let docFormated = ""
            try{
                if(tpCliente == "EMPRESA"){
                    docFormated = formatValue("cnpj", row.original.nrDocumento)
                }else{
                    docFormated = formatValue("cpf", row.original.nrDocumento)
                }
            }catch(e){
                dev_log(()=>console.error(e))
                docFormated = row.original.nrDocumento
            }
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <AvatarCard title={row.original.nmCliente ?? "--"} subtitle={docFormated} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit max-w-96 flex flex-col gap-2">
                        <Badge className="w-fit text-xs">
                            {
                                row.original.tpCliente == "EMPRESA" ? (
                                    <>
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {row.original.tpCliente}
                                    </>
                                ) : (
                                    <>
                                        <User className="w-4 h-4 mr-2" />
                                        {row.original.tpCliente}
                                    </>
                                )
                            }
                        </Badge>
                        <AvatarCard title={row.original.nmCliente ?? "--"} subtitle={docFormated} abbreviateContent={false} avatarAlign="top" />
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        header: "Vendedor",
        cell: ({row}) => {
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <AvatarCard title={row.original.nmUsuario} subtitle={row.original.idUsuario.toString()} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit max-w-96">
                        <AvatarCard title={row.original.nmUsuario} subtitle={row.original.idUsuario.toString()} abbreviateContent={false} avatarAlign="top" />
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        header: "Produto",
        accessorKey: "nmProduto",
        cell: ({row}) => {
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <AvatarCard title={row.original.nmProduto} subtitle={row.original.idProduto.toString()} avatarImageStyle="square" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit max-w-96">
                        <AvatarCard title={row.original.nmProduto} subtitle={row.original.idProduto.toString()} avatarImageStyle="square" abbreviateContent={false} avatarAlign="top" />
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        header: "Data Venda",
        accessorKey: "dtCadastro",
        cell: ({row}) => {
            return <span className="text-sm font-bold">{format(new Date(row.original.dtCadastro), "dd/MM/yyyy HH:mm")}</span>
        }
    },
    {
        header: "Status",
        accessorKey: "chStatusSeguro",
        cell: ({row}) => {
            return <StatusBadge cdStatus={parseInt(row.original.chStatusSeguro)} nmDominio="cdStatusSeguro" />
        }
    },
    {
        header: "Valor",
        accessorKey: "vlPremio",
        cell: ({row}) => {
            return <span className="text-sm font-bold">{row.original.vlPremio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        }
    }
]

export const columnsExpanded: ColumnDef<AnaliticsRecentSalesType>[] = [
    {
        header: "Cliente",
        accessorKey: "nmUsuario",
        cell: ({row}) => {
            return <AvatarCard title={row.original.nmCliente ?? "--"} subtitle={row.original.idSeguro.toString()} />
        }
    },
    {
        header: "Vendedor",
        cell: ({row}) => {
            return <AvatarCard title={row.original.nmUsuario} subtitle={row.original.idUsuario.toString()} />
        }
    },
    {
        header: "Produto",
        accessorKey: "nmProduto",
        cell: ({row}) => {
            return (
                <AvatarCard title={row.original.nmProduto} subtitle={row.original.nmProduto} avatarImageStyle="square" abbreviateContent={false} avatarAlign="top" />
            )
        }
    },
    {
        header: "Data Cadastro",
        accessorKey: "dtCadastro",
        cell: ({row}) => {
            return <span className="text-sm font-bold">{format(new Date(row.original.dtCadastro), "dd/MM/yyyy HH:mm")}</span>
        }
    },
    {
        header: "Status",
        accessorKey: "chStatusSeguro",
        cell: ({row}) => {
            return <StatusBadge cdStatus={parseInt(row.original.chStatusSeguro)} nmDominio="cdStatusSeguro" />
        }
    },
    {
        header: "Valor",
        accessorKey: "vlPremio",
        cell: ({row}) => {
            return <span className="text-sm font-bold">{row.original.vlPremio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        }
    },
    {
        header: "Data Emissão",
        accessorKey: "dtEmissao",
        cell: ({row}) => {
            return <span className="text-sm font-bold">{format(new Date(row.original.dtEmissao), "dd/MM/yyyy HH:mm")}</span>
        }
    },
    {
        header: "Cancelamento",
        accessorKey: "tpCancelamento",
        cell: ({row}) => {
            if(!row.original.tpCancelamento){
                return <span className="text-sm font-bold">--</span>
            }
            return (
                <StatusBadge cdStatus={parseInt(row.original.tpCancelamento)} nmDominio="tpCancelamento" />
            )
        }
    },
]