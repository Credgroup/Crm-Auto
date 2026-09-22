import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { encrypt } from "@/hooks/useCrypt";
import { obterIniciais } from "@/lib/obterIniciais";
import { copyToClipboard, formatValue } from "@/lib/utils";
import { Person } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LuCopy } from "react-icons/lu";
import { Link } from "react-router";

export default function useColumnsBindPerson({
  setSelectPerson,
}: Readonly<{
  setSelectPerson: (id: Partial<Person>) => void;
}>) {
  const columnsBindPerson: ColumnDef<Person>[] = [
    {
      accessorKey: "idSeguradoI2k",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const idOriginal = row.original.idSeguradoI2k.toString();
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
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      cell: ({ row }) => {
        const person = row.original;

        return (
          <Link
            to={`/lead/details/${encodeURIComponent(
              encrypt(
                JSON.stringify({
                  id: person.idSeguradoI2k,
                  type: "person",
                })
              )
            )}`}
          >
            <div className="flex gap-4 p-2 rounded-md hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarFallback className="rounded-full">
                  {obterIniciais(person.nome ?? "??")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-md">{person.nome ?? "??"}</h1>
                <p className="text-xs">
                  {formatValue("cpf", person.cpf.toString())}
                </p>
              </div>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "dataNascimento",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Nascimento" />
      ),
      cell: ({ row }) => {
        const person = row.original;
        if(!person.dataNascimento) return <span>--</span>;
        return (
          <span>{format(new Date(person.dataNascimento ?? ""), "dd/MM/yyyy")}</span>
        );
      },
    },
    {
      accessorKey: "selecionar",
      header: "Selecionar",
      cell: ({ row }) => {
        const person = row.original;
        return (
          <Button onClick={() => setSelectPerson(person)}>Selecionar</Button>
        );
      },
    },
    {
      accessorKey: "cpf",
      enableSorting: false,
      enableColumnFilter: true,
      header: () => null,
      cell: () => null,
    },
  ];

  return columnsBindPerson;
}
