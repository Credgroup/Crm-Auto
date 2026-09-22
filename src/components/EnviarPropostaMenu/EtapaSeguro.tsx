import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SeguroList from "./Components/SeguroList";
import { Button } from "../ui/button";
import { useState } from "react";
import SelectedProductsDialog from "./Components/SelectedProductsDialog";
import { Product } from "@/types";
import { usePartnerStore } from "@/store/partnerStore";

interface EtapaSeguroProps {
  onSuccess?: (etapa: Partial<Product>[]) => void;
}

function EtapaSeguro({ onSuccess }: Readonly<EtapaSeguroProps>) {
  const [selectedProducts, setSelectedProducts] = useState<Partial<Product>[]>(
    []
  );

    const idPartner = usePartnerStore((state) => state.partnerId)
  
    const title = idPartner === "39" ? "questionário de risco" : "proposta"

  const handleSuccess = () => {
    selectedProducts.forEach((item) => {
      delete item.checked;
    });

    const selectedProductsToSend = selectedProducts.map((item) => {
      const proposal = {
        idProduto: item.idProduto,
        nmProduto: item.nmProduto,
      };

      return proposal;
    });

    onSuccess?.(selectedProductsToSend);
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full max-w-lg gap-10 h-[calc(100vh-6em)]"
    >
      <SheetHeader>
        <SheetTitle className="text-2xl text-center">Criar {title}</SheetTitle>
        <SheetDescription className="text-md text-center max-w-xs m-auto">
          Selecione um dos interesses do seu lead para criar {title}
        </SheetDescription>
      </SheetHeader>

      <div className="w-full space-y-4">
        <h1>Todos os produtos</h1>
        <SeguroList
          setSelectedProducts={(data) => setSelectedProducts([...data])}
          selectedProducts={selectedProducts}
        />
      </div>

      <div className="flex flex-col justify-center w-full !max-w-lg gap-y-2">
        <div className="flex flex-row flex-wrap justify-center">
          <SelectedProductsDialog
            products={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
        <div className="flex w-full gap-2">
          <SheetClose asChild className="!m-0 !p-0">
            <Button variant="secondary" className="w-full">
              Cancelar
            </Button>
          </SheetClose>
          <Button
            className="w-full"
            onClick={() => handleSuccess()}
            disabled={selectedProducts.length == 0}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EtapaSeguro;
