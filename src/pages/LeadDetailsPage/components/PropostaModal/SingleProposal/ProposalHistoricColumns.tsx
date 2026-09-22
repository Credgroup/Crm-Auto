import { ColumnDef } from "@tanstack/react-table";
import { GetProposalHistoricItems } from "./ProposalHistoric";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

const columnsProposalHistoric: ColumnDef<GetProposalHistoricItems>[] = [
  {
    accessorKey: "idPropostaHistorico",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "nmEvento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    )
  },
  {
    accessorKey: "tpMovimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Movimento" />
    ),
    cell: ({row}) =>{
        const item = row.original
        return (
            <div>
                <Badge className="rounded-full">{item.dsMovimento}</Badge>
            </div>
        )
    }
  },
  {
    accessorKey: "dsObs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Envio" />
    ),
    cell: ({ row }) => {
      const item = row.original;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <span>{item.dsObs.slice(0, 15)}...</span>
          </HoverCardTrigger>
          <HoverCardContent>
            {item.dsObs}
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "dtHistorico",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Retorno" />
    ),
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div>
            {format(new Date(item.dtHistorico), "dd/MM/yyyy")}
        </div>
      );
    },
  },
];

export default columnsProposalHistoric