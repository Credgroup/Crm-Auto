import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { copyToClipboard } from "@/lib/utils";
import { Proposal } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LuCopy } from "react-icons/lu";
import PropostaModal from "../PropostaModal";
import StatusBadge from "@/components/StatusBadge";
import EditStatusModal from "./EditStatusModal";

export const useSingleProposalColumns = () => {
  const columnsBindPerson: ColumnDef<Partial<Proposal>>[] = [
    {
      accessorKey: "idProposta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const idOriginal = row.original.idProposta ?? "";
        const idResumed = `${idOriginal.slice(0, 3)}...${idOriginal.slice(
          idOriginal.length - 4,
          idOriginal.length
        )}`;
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
      header: "Nome",
      cell: ({ row }) => {
        const proposal = row.original;
        return (
          <div>
            <h1>{proposal.nmProposta}</h1>
          </div>
        );
      },
    },
    {
      accessorKey: "chStatusProposta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const proposal = row.original;

        return <StatusBadge nmDominio="cdStatusProposta" cdStatus={proposal.chStatusProposta} />;
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
      header: "Editar",
      cell: ({row})=>{
        return (
          <EditStatusModal idProposta={row.original.idProposta} />
        )
      }
    },
    {
      header: "Detalhes",
      cell: ({ row }) => {
        const proposal = row.original;
        return (
          <PropostaModal
            id={proposal.idProposta}
            proposalObj={proposal}
            type="single"
          />
        );
      },
    },
  ];

  return columnsBindPerson;
};
