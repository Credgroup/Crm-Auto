import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LuCopy } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { copyToClipboard } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import EditBankDataModal from "./EditBankDataModal";

export type empresasDadosBancariosLayout = {
  totalCount: number;
  items: EmpresaDadosBancarios[]; 
  pageNumber: number; 
  pageSize: number; 
}

export type EmpresaDadosBancarios = {
  idEmpresaDadosBancarios: number;
  idEmpresaOperacao: string;
  nmBanco: string;
  nrAgencia: string;
  nrConta: string;
  tpContaBancaria: number;
  cdStatus: number;
  dtCadastro: string;
  tpPrincipal: number;
};
export const columnsDadosBancarios = (
  refetchBankData?: () => void
): ColumnDef<EmpresaDadosBancarios>[] => [
  {
    accessorKey: "idEmpresaOperacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Empresa" />
    ),
    cell: ({ row }) => {
      const id = row.original.idEmpresaOperacao;
      const resumido = `${id.slice(0, 3)}...${id.slice(-4)}`;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <p className="hover:underline cursor-pointer">{resumido}</p>
          </HoverCardTrigger>
          <HoverCardContent className="flex items-center gap-2 w-fit py-2">
            <span className="text-sm">{id}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(id)}
            >
              <LuCopy />
            </Button>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },

  {
    accessorKey: "nmBanco",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banco" />
    ),
    cell: ({ row }) => {
      const banco = row.original;  
      return (
          <div className="flex gap-4 p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800">          
          <div>
            <h1 className="font-bold text-md">{banco.nmBanco}</h1>
            <p className="text-xs text-muted-foreground">
              Ag {banco.nrAgencia} • Conta {banco.nrConta}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "tpPrincipal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo bancário" />
    ),
    cell: ({row}) => {

      const banco = row.original;

      let ValorTpPrincipal

      if (banco.tpPrincipal == 372) {
        ValorTpPrincipal = "Principal"
      }
      else{
        ValorTpPrincipal = "Não principal"
      }

      return(
      <div>
        <p>
          {ValorTpPrincipal}
        </p>
      </div>)
    }
  },


  {
    accessorKey: "dtCadastro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
    cell: ({ row }) => (
      <span>
        {format(new Date(row.original.dtCadastro), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  },

  {
    accessorKey: "cdStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusBadge
        cdStatus={row.original.cdStatus}
        idDominio={row.original.cdStatus}
      />
    ),
  },
   {
    accessorKey: "idEmpresaDadosBancarios",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Editar" />
    ),
    cell: ({ row }) => (
      <EditBankDataModal
        data={row.original}
        refetchBankData={refetchBankData}
      />
    ),
  },
];
