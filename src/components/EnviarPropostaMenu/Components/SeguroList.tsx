import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SeguroListItem from "./SeguroListItem";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import { execApi } from "@/hooks/useApi";

type SeguroListProps = {
  selectedProducts: Partial<Product>[];
  setSelectedProducts: (productName: Partial<Product>[]) => void;
};

type ProductResponse = {
  items: Product[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};

export default function SeguroList({
  setSelectedProducts,
  selectedProducts,
}: Readonly<SeguroListProps>) {
  const [filterProducts, setFilterProducts] = useState<string>("");
  const idOperation = useOperationStore((state) => state.idOperation);


  const {mutate, isPending, error, isError} = useMutation({
    mutationKey: ["fetchOperationProducts", idOperation],
    mutationFn: async () => {
      const res: any = await execApi({
        url: `api/crm/product/find/operation/${idOperation}`,
        method: "GET",
        data: {},
        isCrmApi: true,
      });

      if ("sucesso" in res.data && !res.data.sucesso) {
        throw new Error("Error fetching products");
      }

      console.log(res)
      console.log(res.data)
      return res.data as ProductResponse;
    },
    onSuccess: (data) => {
      console.log("--------------------------------")
      console.log(data)
      console.log("--------------------------------")
      if (data?.items) {
        const updatedProducts = data.items.map((item: Partial<Product>) => {
          const isChecked = selectedProducts.some(
            (product) => product.idProduto === item.idProduto
          );
          return { ...item, checked: isChecked };
        });
        setSeguros(updatedProducts);
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [seguros, setSeguros] = useState<Partial<Product>[]>([]);

  const handleSelectProduct = (id?: number | string) => {
    if (!id) {
      return;
    }

    const selected = seguros.find(
      (seguro) => String(seguro.idProduto) === String(id)
    );
    if (!selected) {
      return;
    }

    const isSelected = selected.checked;

    setSeguros((prev) =>
      prev.map((seguro) =>
        seguro.idProduto === selected.idProduto
          ? { ...seguro, checked: !isSelected }
          : seguro
      )
    );

    if (isSelected) {
      const removeProd = selectedProducts.filter(
        (item) => String(item.idProduto) !== String(selected.idProduto)
      );
      setSelectedProducts(removeProd);
    } else {
      const addProd = [...selectedProducts, selected];
      setSelectedProducts(addProd);
    }
  };

  const handleUpdateList = () => {
    const updatedSeguros = seguros.map((produto) => {
      const isChecked = selectedProducts.some(
        (item: Partial<Product>) => item.idProduto === produto.idProduto
      );
      return { ...produto, checked: isChecked };
    });
    setSeguros(updatedSeguros);
  };

  useEffect(() => {
    if(idOperation) {
      mutate()
    }
  }, [])

  useEffect(() => {
    handleUpdateList();
  }, [selectedProducts]);

  return (
    <>
      <Input
        type="text"
        placeholder="Pesquisar"
        className="w-full mb-2"
        value={filterProducts}
        onChange={(e) => setFilterProducts(e.target.value)}
      />
      <ScrollArea className="w-full h-[334px] px-3 border rounded-xl my-3">
        <div className="flex flex-col gap-3 py-3">
          {seguros.length > 0 &&
            seguros.map((item) => {
              if (
                item?.nmProduto &&
                (item.nmProduto
                  .toLowerCase()
                  .includes(filterProducts.toLowerCase()) ||
                  filterProducts.length === 0)
              ) {
                return (
                  <SeguroListItem
                    key={item.idProduto}
                    product={item}
                    handleSelectProduct={(id) => handleSelectProduct(id ?? "")}
                  />
                );
              }
              return null;
            })}
            {
              !isPending && seguros.length === 0 && (
                <div className="flex justify-center flex-col gap-2 items-center h-full">
                  <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
                </div>
              )
            }
          {isPending && (
            <div className="flex justify-center flex-col gap-2 items-center h-full">
              <div className="h-16 bg-muted rounded-md w-full animate-pulse delay-75"></div>
              <div className="h-16 bg-muted rounded-md w-full animate-pulse delay-100"></div>
              <div className="h-16 bg-muted rounded-md w-full animate-pulse delay-200"></div>
            </div>
          )}
          {
            isError && (
              <div className="flex justify-center flex-col gap-2 items-center h-full">
                <p className="text-sm text-muted-foreground">Erro ao buscar produtos</p>
                <p className="text-sm text-muted-foreground">{error?.message}</p>
              </div>
            )
          }
        </div>
      </ScrollArea>
    </>
  );
}
