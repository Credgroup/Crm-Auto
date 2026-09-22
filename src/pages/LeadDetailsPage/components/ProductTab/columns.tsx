import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import StatusBadge from "@/components/StatusBadge";
import { ProductTable, DocumentosProdutoItem } from "@/types";
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

export default function useColumnsProdutosTab(
  documentosPorSeguro: Record<number, DocumentosProdutoItem[]> = {},
  carregandoDocumentos: Set<number> = new Set(),
  onRefetchDocumentos?: (idSeguro: number) => Promise<void>
) {
  const { data, isLoading } = useDominios({nmDominio: ["cdStatusSeguro"]})
  
  const columnsProdutosTab: ColumnDef<ProductTable>[] = [
    {
      accessorKey: "idSeguro",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const idOriginal = row.original.idSeguro ?? "";
        const idResumed = idOriginal;
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
        <DataTableColumnHeader column={column} title="Nome" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <StatusBadge cdStatus={item.chStatusSeguro ?? 0} dominiosList={data && data[0]} />;
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
    {
      accessorKey: "segundavia",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="2ª via bilhete" />
      ),
      cell: ({row}) => {
        const idSeguro = row.original.idSeguro.toString();
        const cdStatusSeguro = row.original.cdStatusSeguro;
        const idProduct = row.original.idProduto.toString();
        const documentos = documentosPorSeguro[row.original.idSeguro] || [];
        const estaCarregando = carregandoDocumentos.has(row.original.idSeguro);
        const hasBilhete = documentos.some((doc) => doc.chDocumento === 6);
        
        // Enquanto estiver carregando, mostra skeleton
        if (estaCarregando) {
          return <Loader2 className="h-5 w-5 rounded animate-spin" />;
        }

        if(cdStatusSeguro == 449 && hasBilhete == false){
          return <ButtonGenerateSegundaVia 
            idSeguro={idSeguro} 
            idProduct={idProduct}
            onSuccess={() => onRefetchDocumentos?.(row.original.idSeguro)}
          />
        }

        if(cdStatusSeguro == 449 && hasBilhete == true){
          return "Bilhete já gerado"
        }

        // Depois de carregar, mostra botão apenas se tiver bilhete
        return "___";
      },
    },
    {
      accessorKey: "mais",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mais" />
      ),
      cell: ({row}) => {
        const item = row.original;
        return <MoreProductModal id={item.idProduto} product={item} />;
      },
    },
  ];

  return {
    columns: columnsProdutosTab,
    columnsLoading: isLoading,
  }
}
