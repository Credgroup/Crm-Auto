import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { ProductTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { LuClipboardList  } from "react-icons/lu";
import { format } from "date-fns";
import StatusBadge from "@/components/StatusBadge";
import useDominios from "@/hooks/useDominios";

type SeguroModalProps = {
  id: string;
  nome: string | undefined;
};

type ProductTableResponse = {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: ProductTable[];
};

function SeguroModal({ id, nome }: Readonly<SeguroModalProps>) {
  const [open, setOpen] = useState(false);

  const { data: dominiosData, isLoading: dominiosLoading } = useDominios({nmDominio: ["cdStatusSeguro"]});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seguros", id],
    queryFn: async () => {
      const url = `api/crm/insurance/find/list/segurado/${id}`;
      const res = await execApi({
        url,
        method: "GET",
        data: {},
        isCrmApi: true,
      });
      return res.data as ProductTableResponse;
    },
    enabled: open && !!id,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo<ColumnDef<ProductTable>[]>(() => [
    {
      accessorKey: "idSeguro",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Seguro" />
      ),
      cell: ({ row }) => <span>{row.original.idSeguro}</span>,
    },
    {
      accessorKey: "nmProduto",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produto" />
      ),
      cell: ({ row }) => <span>{row.original.nmProduto}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
          const item = row.original;
          return <StatusBadge cdStatus={item.chStatusSeguro ?? 0} dominiosList={dominiosData && dominiosData[0]} />;
      },
  },
    {
      accessorKey: "dtCadastro",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({row}) => {
          const item = row.original;
          return <p>{item.dtCadastro ? format(new Date(item.dtCadastro), "dd/MM/yyyy HH:mm") : "--"}</p>;
      },
  },
  ], [dominiosData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-0 w-10 h-10 font-normal">
          <LuClipboardList />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Produtos Vinculados à {nome}</DialogTitle>
          <DialogDescription>
            Lista de produtos associados a este lead.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full">
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            pageCount={Math.ceil((data?.totalCount ?? 0) / 10)}
            pageIndex={0}
            onPageChange={() => {}}
            error={isError}
            loading={isLoading || dominiosLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SeguroModal;