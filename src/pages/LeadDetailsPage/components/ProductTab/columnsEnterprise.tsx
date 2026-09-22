import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import StatusBadge from "@/components/StatusBadge";
import { ProductTableEnterprise, DocumentosProdutoItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import MoreProductModal from "./MoreProductModal";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { LuCopy } from "react-icons/lu";
import { copyToClipboard } from "@/lib/utils";
import { format } from "date-fns";
import useDominios from "@/hooks/useDominios";
import ButtonGenerateSegundaVia from "./MoreProductModal/components/ButtonGenerateSegundaVia";
import { Loader2 } from "lucide-react";

export default function useColumnsProdutosTabEnterprise(
  documentosPorSeguro: Record<number, DocumentosProdutoItem[]> = {},
  carregandoDocumentos: Set<number> = new Set(),
  onRefetchDocumentos?: (idSeguro: number) => Promise<void>,
  id?: string
) {
  const { data, isLoading } = useDominios({ nmDominio: ["cdStatusSeguro"] });

  const columnsProdutosTabEnterprise: ColumnDef<ProductTableEnterprise>[] = [
    {
      accessorKey: "idSeguro",
      id: id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const idOriginal = row.original.idSeguro;
        return (
          <HoverCard>
            <HoverCardTrigger>
              <p className="hover:underline">{idOriginal}</p>
            </HoverCardTrigger>
            <HoverCardContent className="flex items-center gap-4 w-fit py-2">
              <p className="text-sm">{idOriginal}</p>
              <Button
                size="icon"
                className="aspect-square"
                variant="ghost"
                onClick={() => copyToClipboard(idOriginal.toString())}
              >
                <LuCopy />
              </Button>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "nmProduto",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produto" />
      ),
    },
    {
      accessorKey: "dsStatusSeguro",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <StatusBadge
            cdStatus={item.chStatusSeguro ?? 0}
            dominiosList={data && data[0]}
          />
        );
      },
    },
    {
      accessorKey: "dtEmissao",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emissão" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <p>
            {item.dtEmissao
              ? format(new Date(item.dtEmissao), "dd/MM/yyyy HH:mm")
              : "--"}
          </p>
        );
      },
    },
    {
      accessorKey: "vlPremio",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prêmio" />
      ),
      cell: ({ row }) => {
        const value = row.original.vlPremio;
        return (
          <p>
            {value?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        );
      },
    },
    {
      accessorKey: "segundavia",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="2ª via bilhete" />
      ),
      cell: ({ row }) => {
        const idSeguro = row.original.idSeguro.toString();
        const idProduct = row.original.idProduto.toString();
        const documentos = documentosPorSeguro[row.original.idSeguro] || [];
        const estaCarregando = carregandoDocumentos.has(row.original.idSeguro);
        const hasBilhete = documentos.some(
          (doc) => doc.chDocumento === 6
        );

        if (estaCarregando) {
          return <Loader2 className="h-5 w-5 rounded animate-spin" />;
        }

        if (row.original.cdStatusSeguro === 449 && !hasBilhete) {
          return (
            <ButtonGenerateSegundaVia
              idSeguro={idSeguro}
              idProduct={idProduct}
              onSuccess={() =>
                onRefetchDocumentos?.(row.original.idSeguro)
              }
            />
          );
        }

        if (row.original.cdStatusSeguro === 449 && hasBilhete) {
          return "Bilhete já gerado";
        }

        return "___";
      },
    },
    {
      accessorKey: "mais",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mais" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <MoreProductModal id={item.idProduto} product={item} idEmpresaOperation={id}/>;
      },
    },
  ];

  return {
    columns: columnsProdutosTabEnterprise,
    columnsLoading: isLoading,
  };
}
