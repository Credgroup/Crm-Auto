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
import { Link } from "react-router";
import { encrypt } from "@/hooks/useCrypt";



export type Colaborador = {
    nmSegurado: string;
    idSegurado: number;
    idSeguradoI2k: number;
    idExterno: string;
    dtNascimento: string;
    dataCadastro: string;
    idUsuario: number;
}

export const columnsColaboradores: ColumnDef<Colaborador>[] = [
  {
    accessorKey: "nmSegurado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const colaborador = row.original;

      if(!colaborador.idSeguradoI2k){
        return (
          <div className="flex flex-col p-3 rounded-md hover:bg-zinc-200 group dark:hover:bg-zinc-700/50 transition-all">
            <span className="font-semibold">{colaborador.nmSegurado}</span>
          </div>
        )
      }

      return (
          <Link
            to={`/lead/details/${encodeURIComponent(
              encrypt(
                JSON.stringify({
                  id: colaborador.idSeguradoI2k,
                  type: "person",
                })
              )
            )}`}
            className="flex flex-col p-3 rounded-md cursor-pointer hover:bg-zinc-200 group dark:hover:bg-zinc-700/50 transition-all"
          >
            <span className="font-semibold group-hover:underline">{colaborador.nmSegurado}</span>
            <span className="text-xs text-muted-foreground">
              I2k - {colaborador.idSeguradoI2k}
            </span>
          </Link>
      );
    },
  },

  {
    accessorKey: "idExterno",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Externo" />
    ),
    cell: ({ row }) => {
      const id = row.original.idExterno;
      // const resumido = `${id.slice(0, 3)}...${id.slice(-3)}`;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <p className="hover:underline cursor-pointer">{id}</p>
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
    accessorKey: "dataCadastro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
    cell: ({ row }) => {
      let data = String(row.original.dataCadastro)
      try {
        data = format(new Date(row.original.dataCadastro), "dd/MM/yyyy HH:mm")
      } catch (error) {
        data = String(row.original.dataCadastro)
      }
      return <span>{data}</span>
    },
  },
];