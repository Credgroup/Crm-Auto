import { ProductTable } from "@/types";
import ShowHideInformation from "../../../ShowHideInformation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type DetailsProductProps = {
  product: Partial<ProductTable>;
};

export default function DetailsProduct({ product }: Readonly<DetailsProductProps>) {
    const [canViewInfo, setCanViewInfo] = useState(false);
    useEffect(() => {
      console.log(product);
    }, []);
  return (
    <>
        <div className="flex items-center space-x-2 mb-8">
            <p className="font-medium text-xl">Detalhes do produto</p>
            <Tooltip>
            <TooltipTrigger asChild>
                <Button
                size="icon"
                variant="secondary"
                className="w-8 h-8"
                onClick={() => setCanViewInfo((prev) => !prev)}
                >
                {canViewInfo && <EyeOff />}
                {!canViewInfo && <Eye />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
            </Tooltip>
        </div>
        <div className="h-full">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/70 rounded-md">
                <div>
                    <p className="text-sm text-gray-500">Nome:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.nmProduto ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">ID:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.idSeguro ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Data de emissão:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.dtEmissao
                            ? format(new Date(product.dtEmissao), "dd/MM/yyyy HH:mm")
                            : "--"}</p>
                        
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Status do produto:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.dsStatusSeguro   ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Data de Cadastro:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">
                        {product.dtCadastro
                            ? format(new Date(product.dtCadastro), "dd/MM/yyyy HH:mm")
                            : "--"}
                        </p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Tipo de Adesão:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.dsAdesao ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Quantidade de parcelas:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.qtParcelas ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Valor da parcela:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.vlParcela ?? "--"}</p>
                    </ShowHideInformation>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Valor do prêmio:</p>
                    <ShowHideInformation show={canViewInfo}>
                        <p className="font-medium">{product.vlPremio ?? "--"}</p>
                    </ShowHideInformation>
                </div>
            </div>
        </div>
    </>
  );
}