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
import { FileJson, Undo2 } from "lucide-react";
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
  idseguromulticanalcallback: number;
  idseguradomulticanal: number;
  tpcallback: number;
  dscallback: string;
  chcallback: string;
  jsonenvio: string;
  jsonretorno: string;
  observacao: string;
  cadastro: string;
}

const data: Transacao[] = [
  {
    idseguromulticanalcallback: 2185,
    idseguradomulticanal: 1020,
    tpcallback: 5169,
    dscallback: "Abriu E-mail",
    chcallback: "4",
    jsonenvio: "b1192218dcadbe4bb23048c47280bfd2",
    jsonretorno:
      '[{"Key":"Accept","Value":"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"},{"Key":"Accept-Encoding","Value":"gzip, deflate, br"},{"Key":"Accept-Language","Value":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"},{"Key":"Host","Value":"devapi2.keepins.com.br"},{"Key":"User-Agent","Value":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"},{"Key":"X-Forwarded-Scheme","Value":"https"},{"Key":"X-Forwarded-Proto","Value":"https"},{"Key":"X-Forwarded-For","Value":"177.92.89.14"},{"Key":"X-Real-IP","Value":"177.92.89.14"},{"Key":"sec-ch-ua","Value":"\\" Not A;Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"96\\", \\"Google Chrome\\";v=\\"96\\""},{"Key":"sec-ch-ua-mobile","Value":"?0"},{"Key":"sec-ch-ua-platform","Value":"\\"Windows\\""},{"Key":',
    observacao: "Leu E-mail",
    cadastro: "20/12/2021 11:28:37",
  },
];

const columnsTransacao: ColumnDef<Transacao>[] = [
  {
    accessorKey: "idseguromulticanalcallback",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Callback" />
    ),
  },
  {
    accessorKey: "dscallback",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge className="px-2 text-xs font-bold text-green-800 bg-green-300 hover:bg-green-400  rounded-full">
          {item.dscallback}
        </Badge>
      );
    },
  },
  {
    accessorKey: "observacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Obeservação" />
    ),
  },
  {
    accessorKey: "cadastro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
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

function CallbackModal() {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="w-full" asChild>
              <Button size="icon" variant="ghost">
                <Undo2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Callback</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Callback</DialogTitle>
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

export default CallbackModal;
