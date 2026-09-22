import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { copyToClipboard } from "@/lib/utils";
import { ProposalGroup } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LuCopy } from "react-icons/lu";
import PropostaModal from "../PropostaModal";
import StatusBadge from "@/components/StatusBadge";

export const useAgroupProposalColumns = () => {
  const columnsBindPerson: ColumnDef<Partial<ProposalGroup>>[] = [
    {
      accessorKey: "idGrupoProposta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const idOriginal = row.original.idGrupoProposta ?? "";
        const idResumed = idOriginal;
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
      },
    },
       {
      accessorKey: "nmGrupoProposta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Agrupamento" />
      ),
      cell: ({row}) => {
        const proposal = row.original;
        return (
          <div>
            <p className="text-sm">{proposal.nmProposta ?? "--"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "cdStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const proposal = row.original;

        return (
          <StatusBadge
            cdStatus={proposal.cdStatus}
            idDominio={proposal.cdStatus}
          />
        );
      },
    },
 
    {
      accessorKey: "dtCadastro",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Criação" />
      ),
      cell: ({ row }) => {
        const dtCadastro = row.original.dtCadastro ?? "";
        return <span>{format(new Date(dtCadastro), "dd/MM/yyyy")}</span>;
      },
    },
    {
      header: "Detalhes",
      cell: ({ row }) => {
        const proposal = row.original;
        return (
          <PropostaModal
            id={proposal.idGrupoProposta}
            proposalObj={proposal}
            type="multiple"
          />
        );
      },
    },
  ];

  return columnsBindPerson;
};
