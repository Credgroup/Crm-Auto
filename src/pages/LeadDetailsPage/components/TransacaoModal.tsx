import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRightLeft, FileJson } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Transacao {
  idseguradotransacao: string;
  tpprocesso: string;
  tpmovimento: string;
  dtenvio: string;
  tpprocessostatus: string;
  dtcadastro: string;
  chprocesso: string;
  processo: string;
  chmovimento: string;
  movimento: string;
  jsonenvio: string;
  jsonretorno: string;
  chprocessosstatus: string;
  processosstatus: string;
  idseguradoi2k: string;
  idseguradomulticanal: string;
}

const data: Transacao[] = [
  {
    idseguradotransacao: "2722",
    tpprocesso: "413",
    tpmovimento: "7434",
    dtenvio: "24/06/2024 11:18:55",
    tpprocessostatus: "629",
    dtcadastro: "2022-06-24T11:18:55.593",
    chprocesso: "1",
    processo: "Sistema",
    chmovimento: "16",
    movimento: "Envio WebHook Cliente",
    jsonenvio:
      '{\n"testecampo1":"DILMA CATUREBA",\n"testecampo2":"65261240115"\n}',
    jsonretorno:
      '{"route":"POST /callback #5000 #5120","params":{},"query":{},"body":{"testecampo1":"DILMA CATUREBA","testecampo2":"65261240115"},"files":[],"headers":{"connection":"Keep-Alive","host":"webhook.keepins.com.br","x-forwarded-scheme":"https","x-forwarded-proto":"https","x-forwarded-for":"177.92.89.14","x-real-ip":"177.92.89.14","content-length":"60","authorization":"Basic Og==","accept":"application/json, text/json, text/x-json, text/javascript, application/xml, text/xml","user-agent":"RestSharp/106.12.0.0","accept-encoding":"gzip, deflate","content-type":"application/json"},"url":"/callback/","ip":"177.92.89.14","cookies":{}}',
    chprocessosstatus: "2",
    processosstatus: "Enviado Sucesso",
    idseguradoi2k: "2025",
    idseguradomulticanal: "",
  },
];

const columnsTransacao: ColumnDef<Transacao>[] = [
  {
    accessorKey: "idseguradotransacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "movimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Movimento" />
    ),
  },
  {
    accessorKey: "dtenvio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Envio" />
    ),
  },
  {
    accessorKey: "processosstatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge className="px-2 text-xs font-bold text-green-800 bg-green-300 hover:bg-green-400  rounded-full">
          {item.processosstatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "jsonenvio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Envio" />
    ),
    cell: ({ row }) => {
      const item = row.original;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <FileJson className="text-green-400" />
          </HoverCardTrigger>
          <HoverCardContent>
            <Textarea readOnly rows={10} value={item.jsonenvio}></Textarea>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "jsonretorno",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Retorno" />
    ),
    cell: ({ row }) => {
      const item = row.original;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <FileJson className="text-red-400" />
          </HoverCardTrigger>
          <HoverCardContent>
            <Textarea readOnly rows={10} value={item.jsonretorno}></Textarea>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];

function TransacaoModal() {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="w-full" asChild>
              <Button size="icon" variant="ghost">
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Transação</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Transação</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <DataTable
            columns={columnsTransacao}
            data={data}
            filter={["idExterno"]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TransacaoModal;
