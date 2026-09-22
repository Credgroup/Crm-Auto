import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { execApi } from "@/hooks/useApi";
import { Product, SessaoType } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ProductFormSummaryProps = {
  idProduct?: string | null;
  sidebar?: Partial<SessaoType>[] | null;
};

async function fetchProductInfo(idProduct?: string | null){
  if(!idProduct){
    throw new Error("Id do produto não encontrado")
  }
  const res: any = await execApi({
    
    url: `api/crm/product/find/${idProduct}`,
    method: "GET",
    needLogout: true,
    isCrmApi: true,	
    data: {}
  })

  console.log('--------------------------')
  console.log(res)

  return res.data as Partial<Product>
}

const ProductFormSummary: React.FC<Readonly<ProductFormSummaryProps>> = ({ idProduct, sidebar }) => {

  const { data: productDetails, isSuccess } = useQuery({
    queryKey: ["productDetails", idProduct],
    queryFn: ()=> fetchProductInfo(idProduct),
    enabled: !!idProduct,
    refetchOnWindowFocus: false
  });

  useEffect(()=>{
    if(isSuccess && productDetails){
      console.log("productDetails", productDetails)
    }
  }, [isSuccess, productDetails])

  // Extract real-time values from the form
  const extractFieldValue = (campoApi: string) => {
    if (!sidebar) return undefined;
    for (const session of sidebar) {
      if (session.campos) {
        const field = session.campos.find(c => c.campoApi === campoApi);
        if (field && field.conteudo) {
          // Remove currency mask to get raw number
          return parseFloat(field.conteudo.replace(/[^0-9]/g, "")) / 100;
        }
      }
    }
    return undefined;
  };

  const extractStringValue = (campoApi: string) => {
    if (!sidebar) return undefined;
    for (const session of sidebar) {
      if (session.campos) {
        const field = session.campos.find(c => c.campoApi === campoApi);
        if (field && field.conteudo) {
          return field.conteudo;
        }
      }
    }
    return undefined;
  };

  const valorVeiculoLive = extractFieldValue("valorVeiculo");
  const valorEntradaLive = extractFieldValue("valorEntrada");
  const qtParcelasLive = extractStringValue("qtParcelas") || productDetails?.qtParcelas;

  const valorSubtotal = valorVeiculoLive !== undefined ? valorVeiculoLive : (productDetails?.vlPremio ? parseFloat(productDetails.vlPremio) : undefined);
  const valorFinanciado = (valorVeiculoLive || 0) - (valorEntradaLive || 0);
  
  const cotacoesRaw = extractStringValue("cotacoesDisponibilizadas");
  let cotacoes: any = null;
  if (cotacoesRaw) {
    try { cotacoes = JSON.parse(cotacoesRaw); } catch(e){}
  }

  let vlParcelaLive = undefined;
  let qtParcelasFinal = qtParcelasLive;

  if (cotacoes?.financiamentos?.length > 0) {
    const fin = cotacoes.financiamentos[0];
    vlParcelaLive = parseFloat(String(fin.valorParcela).replace(',', '.'));
    qtParcelasFinal = String(fin.parcelas);
  } else if (valorFinanciado > 0 && qtParcelasLive) {
    // Fake PMT simple calc para visualização em tempo real antes de chegar na tela de cotação
    const rate = 1.5 / 100; // 1.5% fake
    const n = parseInt(qtParcelasLive);
    if (!isNaN(n) && n > 0) {
      vlParcelaLive = (valorFinanciado * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    }
  }

  const finalVlParcela = vlParcelaLive !== undefined ? vlParcelaLive : (productDetails?.vlParcela ? parseFloat(productDetails.vlParcela) : undefined);

  return (
    <Card className="w-full p-6 flex flex-col gap-4 min-w-72">
      <div className="flex gap-3 items-start mb-2">
        <div className="min-w-16 min-h-16 max-w-16 max-h-16 aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden border">
          <img src={productDetails?.dsLogo} className="object-cover w-full h-full aspect-square" alt={productDetails?.nmProduto ?? ""} />
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">{productDetails?.nmProduto}</div>
          <div className="text-zinc-500 text-sm leading-tight line-clamp-2">
            {productDetails?.dsProduto}
          </div>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between font-semibold">
          <span>SUBTOTAL</span>
          <span>{valorSubtotal !== undefined ? `R$${valorSubtotal.toFixed(2).replace(".", ",")}` : "--"}</span>
        </div>
        {
          qtParcelasFinal && (
            <div className="flex justify-between font-semibold">
              <span>PARCELAS</span>
              <span>Em até {qtParcelasFinal}x</span>
            </div>
          )
        }
      </div>
      <div className="flex justify-between items-center bg-muted rounded-lg px-4 py-3 font-bold text-lg mt-2">
        <span>Total</span>
        {
          qtParcelasFinal ? (
            <div className="flex flex-col gap-0 items-end">
              <div className="flex flex-row gap-1 items-baseline">
                <span className="text-xs">{qtParcelasFinal}x de</span>
                <b className="text-2xl">{finalVlParcela !== undefined ? `R$${finalVlParcela.toFixed(2).replace(".", ",")}` : "--"}</b>
              </div>
              <span className="text-xs">ou <b>{valorSubtotal !== undefined ? `R$${valorSubtotal.toFixed(2).replace(".", ",")}` : "--"}</b> à vista</span>
            </div>
          ) : (
            <span>{valorSubtotal !== undefined ? `R$${valorSubtotal.toFixed(2).replace(".", ",")}` : "--"}</span>
          )
        }
      </div>
      <div className="flex items-center justify-center gap-2">
        <label htmlFor="aceite" className="text-xs text-zinc-500 select-none text-center">
          Estou ciente que este produto está sujeito aos termos.
        </label>
      </div>
    </Card>
  );
};

export default ProductFormSummary;
