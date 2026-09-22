import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePixQrCode } from "@/hooks/useGenerateQrCodePix";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, RefreshCcwIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { execApi } from "@/hooks/useApi";

export interface PixCopyPasteResponse {
    sucesso: boolean;
    mensagem: string;
    dadosPagamento: DadosPagamento;
}
  
export interface DadosPagamento {
codePagamentoExterno: string;
nrProposta: string;
dtExpericao: string;
nrParcela: number;
valorParcela: number;
arquivoExterno: string;
pixCopiaCola: string;
}

async function generatePixCopyPaste(idPaymentMethod: number | null, idProduct?: string | null) {
    if(!idPaymentMethod || !idProduct) return;

    const data = { idOperacaoMeioPagamento: idPaymentMethod, idSeguro: parseInt(idProduct) }

    const response = await execApi({
      url: "api/crm/payment/generate",
      data,
      isCrmApi: true,
      method: "POST",
    })

    const responseData = response.data as PixCopyPasteResponse;

    if(!responseData.sucesso){
        throw new Error(responseData.mensagem ?? "Erro ao gerar pix")
    }

    return responseData.dadosPagamento;
}

type PixCopyPasteProps = {
  idPaymentMethod: number | null;
  idSeguro?: string | null;
}

export default function PixCopyPaste({ idPaymentMethod, idSeguro }: Readonly<PixCopyPasteProps>) {

    const { data: pixData, isLoading, isSuccess, isError, error, refetch, isRefetching } = useQuery({
        queryKey: ["generatePixCopyPaste", idPaymentMethod, idSeguro],
        queryFn: () => generatePixCopyPaste(idPaymentMethod, idSeguro),
        enabled: !!idSeguro && !!idPaymentMethod,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: false,
        staleTime: 0,

    })

      const { generate, loading: loadingGeneratePix, error: errorGeneratePix, qrCode: qrCodePix } = usePixQrCode();

    useEffect(()=>{
        if(isSuccess && pixData){
            console.log(pixData)
            generate(pixData.pixCopiaCola)
        }
    }, [isSuccess, pixData])

    useEffect(()=>{
        if(isError){
            console.log(error)
            toast.error(error?.message)
        }
    }, [isError, error])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        {
            pixData && !isLoading && !isError && (
                <div className="flex flex-col items-center justify-center space-y-2 w-full">
                    <h1 className="text-2xl font-bold">Pix gerado com sucesso!</h1>
                    {
                      pixData?.nrParcela && pixData?.valorParcela && (
                        <h3 className="font-semibold">{pixData.nrParcela}x de R$ {Number(pixData.valorParcela).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      )
                    }
                    <h3>Data de vencimento: {format(new Date(pixData?.dtExpericao), "dd/MM/yyyy HH:mm")}</h3>
                </div>
            )
        }
        <div className="flex flex-col items-center justify-center w-full">
                {
                  !loadingGeneratePix && qrCodePix && !isError && (
                    <div className="bg-muted p-4 py-10 rounded-sm w-full flex flex-col items-center justify-center">
                        <QRCode value={qrCodePix} className='w-full aspect-square'/>
                    </div>
                )}

                {
                  loadingGeneratePix && (
                    <div className="w-48 h-48 mx-auto">
                      <Loader2 className="w-8 h-8 animate-spin text-[var(--cor-principal)]" />
                    </div>
                  )
                }

                {
                  errorGeneratePix && (
                    <div className="w-48 h-48 mx-auto">
                      <p className="text-sm text-gray-600 mt-2">Erro ao gerar QR Code</p>
                    </div>
                  )
                }
        </div>

        {
            pixData && !isLoading && !isError && (
                <div className="flex flex-col items-center justify-center space-y-2 w-full">
                    
                    <Input type="text" placeholder="Código de pagamento" value={pixData?.pixCopiaCola ?? ""} readOnly />
                    <Button className="w-full">Copiar</Button>
                    <Button variant="secondary" className="w-full" onClick={() => {
                        window.open(pixData?.arquivoExterno, "_blank")
                    }}>Baixar arquivo</Button>
                    <p className="text-sm text-muted-foreground">Copie o código e cole no seu aplicativo de pagamento</p>
                </div>
            )
        }

        {
            isLoading && (
                <PixFormSkeleton />
            )
        }

        {
            isError && (
                <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-xl font-bold">Erro ao gerar pix</p>
                    <p className="text-muted-foreground">{error?.message}</p>
                    <Button onClick={() => refetch()}><RefreshCcwIcon className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")} /> Tentar novamente</Button>
                </div>
            )
        }
    </div>
  )
}

function PixFormSkeleton(){
    return (
      <div className='flex flex-col gap-y-4 w-full justify-center items-center'>
        <div className='flex gap-y-2 w-full flex-col items-center'>
          <div className="w-3/5 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
          <div className="w-1/3 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
        </div>
        <div className='w-full max-w-72 aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse'></div>
        <div className='flex gap-y-2 flex-col items-center w-4/5'>
          <div className='w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse'></div>
          <div className='w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse'></div>
  
        </div>
      </div>
    )
  }