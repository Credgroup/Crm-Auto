import { ColumnDef } from "@tanstack/react-table";
import { obterIniciais } from "@/lib/obterIniciais";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EnviarPropostaMenu } from "@/components/EnviarPropostaMenu";
import { Link } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LuCopy } from "react-icons/lu";
import { copyToClipboard, formatValue } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Enterprise, Person } from "@/types";
import { encrypt } from "@/hooks/useCrypt";
import StatusBadge from "@/components/StatusBadge";
import { partnerId } from "@/store/partnerStore";
import SeguroModal from "./SeguroModal";

export const columnsEnterprise: ColumnDef<Enterprise>[] = [
  {
    accessorKey: "idEmpresaOperacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const idOriginal = row.original.idEmpresaOperacao ?? "idEmpresaOperacao inexistente";
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
    accessorKey: "nmFantasia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const enterprise = row.original;

      return (
        <Link
          to={`/lead/details/${encodeURIComponent(
            encrypt(
              JSON.stringify({
                id: enterprise.idEmpresaOperacao,
                type: "enterprise",
              })
            )
          )}`}
        >
          <div className="flex gap-4 p-2 rounded-md hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarFallback className="rounded-full">
                {obterIniciais(enterprise.nmFantasia)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-md">{enterprise.nmFantasia}</h1>
              <p className="text-xs">
                {formatValue("cnpj", enterprise.nrCNPJ)}
              </p>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "dtCadastro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
    cell: ({ row }) => {
      const enterprise = row.original;
      return (
        <span>
          {format(new Date(enterprise.dtCadastro), "HH:mm dd/MM/yyyy")}
        </span>
      );
    },
  },
  {
    accessorKey: "qtSeguros",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd de Produtos" />
    ),
    cell: ({ row }) => {
      const qtSeguros = row.original.qtdSeguros;
      if (!qtSeguros) {
        return <span>--</span>;
      }
      return (
        <div className="flex w-full justify-start pl-[30%]">
    <span
      className="
        flex items-center justify-center
        min-w-[24px] h-6 px-2
        rounded-full
        bg-[var(--cor-principal)]
        text-white
        text-xs font-bold
      "
    >
          {qtSeguros}
        </span>
      </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const enterprise = row.original;

      return (
        <StatusBadge
          cdStatus={enterprise.cdStatus}
          idDominio={enterprise.cdStatus}
        />
      );
    },
  },
  {
    accessorKey: "proposta",
    header: () => (
      partnerId == "39" ? "Questionario" : "Proposta"
    ),
    cell: ({ row }) => {
      const enterprise = row.original;
      return <EnviarPropostaMenu ButtonType="icon" cliData={enterprise} />;
    },
  },
  {
    accessorKey: "nrCNPJ",
    enableSorting: false,
    enableColumnFilter: true,
    header: () => null,
    cell: () => null,
  },
];

export const columnsPerson: ColumnDef<Partial<Person>>[] = [
  {
    accessorKey: "idSeguradoI2k",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const idOriginal = row.original.idSeguradoI2k?.toString() ?? "";
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
                {formatValue("cpf", person.cpf?.toString() ?? "")}
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
      if (!person.dataNascimento) {
        return <span>--</span>;
      }
      return (
        <span>{format(new Date(person.dataNascimento ?? ""), "dd/MM/yyyy")}</span>
      );
    },
  },
  {
    accessorKey: "qtSeguros",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd de Produtos" />
    ),
    cell: ({ row }) => {
      const qtSeguros = row.original.qtSeguros;
      if (!qtSeguros) {
        return <span>--</span>;
      }
      return (
        <div className="flex w-full justify-start pl-[30%]">
    <span
      className="
        flex items-center justify-center
        min-w-[24px] h-6 px-2
        rounded-full
        bg-[var(--cor-principal)]
        text-white
        text-xs font-bold
      "
    >
          {qtSeguros}
        </span>
      </div>
      );
    },
  },
  {
    accessorKey: "Detalhes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalhes" />
    ),
    cell: ({ row }) => {
      const person = row.original;
      const qtSeguros = row.original.qtSeguros;

      if (!qtSeguros) {
        return <SeguroModal id={row.original.idSeguradoI2k!} nome={person.nome} />;
      }
      return <SeguroModal id={row.original.idSeguradoI2k!} nome={person.nome} />;
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