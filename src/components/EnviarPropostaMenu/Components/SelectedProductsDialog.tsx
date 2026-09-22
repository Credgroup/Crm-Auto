import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import { LuArrowRight, LuX } from "react-icons/lu";

type SelectedProductsDialogProps = {
  products: Partial<Product>[];
  setSelectedProducts: Dispatch<SetStateAction<Partial<Product>[]>>;
};
export default function SelectedProductsDialog({
  products,
  setSelectedProducts,
}: Readonly<SelectedProductsDialogProps>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full group">
          ({products.length}) Produtos selecionados
          <LuArrowRight className="group-hover:translate-x-2 group-hover:opacity-100 transition-all opacity-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Produtos selecionados
          </DialogTitle>
          <DialogDescription className="opacity-0"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-row flex-wrap gap-2 justify-center h-full">
          {products.length > 0 &&
            products.map((item, i) => (
              <div key={item.idProduto}>
                <Button
                  variant="outline"
                  className="text-xs"
                  size="sm"
                  onClick={() => {
                    setSelectedProducts((prev) =>
                      prev.filter((_, index) => index !== i)
                    );
                  }}
                >
                  {item.nmProduto}
                  <LuX />
                </Button>
              </div>
            ))}
          {products.length == 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-md text-center font-semibold">
                Nenhum produto selecionado
              </h1>
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-500">
                Selecione um produto
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
