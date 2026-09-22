import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";

export type CockpitExpandedData = {
  idProposta: string;
  nmProposta: string;
  account: string;
  statusProposta: string;
  dtCadastro: string;
}

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { LuCopy } from "react-icons/lu";
import { copyToClipboard } from "@/lib/utils";
import PropostaModal from "@/pages/LeadDetailsPage/components/PropostaModal";


const columnsCockpitExpanded: ColumnDef<CockpitExpandedData>[] = [
    {
        header: "ID",
        accessorKey: "idProposta",
        cell: ({row}) => {
            const idOriginal = row.original.idProposta;
            const idResumed = idOriginal.slice(0, 10) + "...";
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
                        onClick={() => copyToClipboard(idOriginal)}
                    >
                        <LuCopy />
                    </Button>
                    </HoverCardContent>
                </HoverCard>
            );
        }
    },
    {
        header: "Nome",
        accessorKey: "nmProposta",
        cell: ({row})=>{
            const name = row.original.nmProposta
            const nameResumed = name.slice(0, 20) + "..."
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <p className="hover:underline">{nameResumed}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex items-center gap-4 w-fit py-2">
                        <p className="text-sm">{name}</p>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        header: "Responsável",
        accessorKey: "account"
    },
    {
        header: "Status",
        accessorKey: "statusProposta",
        cell: ({row}) => {
            return <Badge className="rounded-full">{row.original.statusProposta}</Badge>
        }
    },
    {
        header: "Data",
        accessorKey: "dtCadastro",
        cell: ({row}) => {
            return <span>{format(new Date(row.original.dtCadastro), "dd/MM/yyyy HH:mm")}</span>
        }
    },
    {
        header: "Visualizar",
        accessorKey: "teste",
        cell: ({row})=>{
            return <PropostaModal proposalObj={{}} id={row.original.idProposta} type="single" fetchSingleProposal={true} />
        }
    }

]

export default columnsCockpitExpanded