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

  // 1. Seguros com cotação sob demanda multi-seguradora (Seguro Auto e Seguro Caminhão)
  const isVariableInsurance = idProduct === "3" || idProduct === "10" || productDetails?.subCategoria === "auto" || productDetails?.subCategoria === "caminhao";

  // 2. Financiamento de Veículos (Crédito Mercedes-Benz Caminhões / Complete F&I)
  const isVehicleFinancing = idProduct === "4" || idProduct === "5" || productDetails?.tpCategoria === 4 || productDetails?.tpCategoria === 5;

  const valorVeiculoLive = extractFieldValue("valorVeiculo");
  const valorEntradaLive = extractFieldValue("valorEntrada");
  const qtParcelasLive = extractStringValue("qtParcelas") || productDetails?.qtParcelas;

  const cotacoesRaw = extractStringValue("cotacoesDisponibilizadas");
  let cotacoes: any = null;
  if (cotacoesRaw) {
    try { cotacoes = JSON.parse(cotacoesRaw); } catch(e){}
  }

  const selectedInsurance = cotacoes?.selectedSeg || (cotacoes?.seguros?.length > 0 ? cotacoes.seguros[0] : null);

  let valorSubtotal: number | undefined = undefined;
  let vlParcelaLive: number | undefined = undefined;
  let qtParcelasFinal = qtParcelasLive;

  if (isVariableInsurance) {
    if (selectedInsurance) {
      valorSubtotal = selectedInsurance.valorPremio;
      vlParcelaLive = selectedInsurance.valorPremio / 12;
      qtParcelasFinal = "12";
    }
  } else if (isVehicleFinancing) {
    valorSubtotal = valorVeiculoLive !== undefined ? valorVeiculoLive : (productDetails?.vlPremio ? parseFloat(productDetails.vlPremio) : undefined);
    const valorFinanciado = (valorVeiculoLive || 0) - (valorEntradaLive || 0);

    if (cotacoes?.financiamentos?.length > 0) {
      const fin = cotacoes.financiamentos[0];
      vlParcelaLive = parseFloat(String(fin.valorParcela).replace(',', '.'));
      qtParcelasFinal = String(fin.parcelas);
    } else if (valorFinanciado > 0 && qtParcelasLive) {
      const rate = 1.5 / 100;
      const n = parseInt(qtParcelasLive);
      if (!isNaN(n) && n > 0) {
        vlParcelaLive = (valorFinanciado * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      }
    }
  } else {
    // 3. Produtos de Plano Fixo (Seguro de Proteção Financeira, Garantia Estendida, Fleet Connect, Serviços)
    valorSubtotal = productDetails?.vlPremio ? parseFloat(productDetails.vlPremio) : (productDetails?.vlParcela && productDetails?.qtParcelas ? parseFloat(productDetails.vlParcela) * parseInt(productDetails.qtParcelas) : undefined);
    vlParcelaLive = productDetails?.vlParcela ? parseFloat(productDetails.vlParcela) : undefined;
    qtParcelasFinal = productDetails?.qtParcelas || "12";
  }

  const finalVlParcela = vlParcelaLive !== undefined ? vlParcelaLive : (!isVariableInsurance && productDetails?.vlParcela ? parseFloat(productDetails.vlParcela) : undefined);

  const formatBRL = (val?: number | string | null) => {
    if (val === undefined || val === null || val === "") return "--";
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return "--";
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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

      {isVariableInsurance && !selectedInsurance ? (
        <div className="space-y-3 pt-2">
          <div className="space-y-1 text-sm border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>COTAÇÃO</span>
              <span className="text-[var(--cor-principal)] font-bold">Sob Demanda</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Seguradoras</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Porto · Tokio · Zurich</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 bg-muted/60 border rounded-lg p-3 text-center">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Cálculo Multi-Seguradora</span>
            <span className="text-[11px] text-muted-foreground leading-snug">
              Os prêmios e parcelas serão calculados de acordo com o veículo na etapa de Cotações.
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1 text-sm border-t pt-2">
            {selectedInsurance && (
              <div className="flex justify-between font-semibold text-xs text-[var(--cor-principal)] mb-1">
                <span>SEGURADORA</span>
                <span>{selectedInsurance.seguradora}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL</span>
              <span>{valorSubtotal !== undefined ? `R$ ${formatBRL(valorSubtotal)}` : "--"}</span>
            </div>
            {qtParcelasFinal && (
              <div className="flex justify-between font-semibold">
                <span>PARCELAS</span>
                <span>Em até {qtParcelasFinal}x</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center bg-muted rounded-lg px-4 py-3 font-bold text-lg mt-2">
            <span>Total</span>
            {qtParcelasFinal ? (
              <div className="flex flex-col gap-0 items-end">
                <div className="flex flex-row gap-1 items-baseline">
                  <span className="text-xs">{qtParcelasFinal}x de</span>
                  <b className="text-2xl">{finalVlParcela !== undefined ? `R$ ${formatBRL(finalVlParcela)}` : "--"}</b>
                </div>
                <span className="text-xs">ou <b>{valorSubtotal !== undefined ? `R$ ${formatBRL(valorSubtotal)}` : "--"}</b> à vista</span>
              </div>
            ) : (
              <span>{valorSubtotal !== undefined ? `R$ ${formatBRL(valorSubtotal)}` : "--"}</span>
            )}
          </div>
        </>
      )}

      <div className="flex items-center justify-center gap-2 mt-1">
        <label htmlFor="aceite" className="text-xs text-zinc-500 select-none text-center">
          Estou ciente que este produto está sujeito aos termos.
        </label>
      </div>
    </Card>
  );
};

export default ProductFormSummary;
