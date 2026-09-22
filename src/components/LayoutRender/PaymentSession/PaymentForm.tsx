import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";
import { SetStateAction, Dispatch, useEffect, useState } from "react";
import { PaymentStatesType } from "@/hooks/ProductFormHook";
import { execApi } from "@/hooks/useApi";
import { PaymentMethod } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import PixCopyPaste from "./PixCopyPaste";
import usePayWebSocket from "@/hooks/usePayWebSocket";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { downloadTicket } from "@/services/ticketService";
import CardForm from "./CardForm";



type PaymentFormProps = {
  setPaymentStates: Dispatch<SetStateAction<PaymentStatesType | null>>
  paymentStates: PaymentStatesType | null;
  idProduct?: string | null;
}

async function fetchPaymentMethods(idProduct?: string | null){
  if(!idProduct){
    throw new Error("Id do produto não encontrado");
  }
  const res: any = await execApi({
    url: `api/crm/payment/options/product/${idProduct}`,
    method: "GET",
    needLogout: true,
    isCrmApi: true,
    data: {},
  });
  return res.data as PaymentMethod[];
}

const URL_WEBSOCKET = import.meta.env.VITE_WS_PAYMENT_URL;

export default function PaymentForm({ setPaymentStates, paymentStates, idProduct }: Readonly<PaymentFormProps>) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<PaymentMethod | null>(null);

    const { isConnected, connect, isWsConnected } = usePayWebSocket({
      url: URL_WEBSOCKET,
      roomId: paymentStates?.insuranceData?.idSeguro.toString(),
      onDevice2Event: (event) => {
        if (event.type === 'PAYMENT_SUCCESS') {
          console.log('🎉 Pagamento realizado com sucesso!');
          toast.success('Pagamento realizado com sucesso!');
          setPaymentStates((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              paymentSuccess: true,
              paymentStatus: "paid"
            };
          });
        }
      },
    });

    useEffect(()=>{
      if(paymentStates?.insuranceData?.idSeguro && !isWsConnected()){
        connect();
      }
    }, [])

    const { data: paymentMethodsData, isError, error, isSuccess, isLoading } = useQuery({
      queryKey: ["paymentMethods", idProduct],
      queryFn: () => fetchPaymentMethods(idProduct),
      enabled: !!idProduct,
      refetchOnWindowFocus: false,
    });

    const { mutate: downloadTicketMutate, isPending } = useMutation({
      mutationKey: ["downloadTicket", idProduct, paymentStates?.insuranceData?.idSeguro],
      mutationFn: () => {
        if (!paymentStates?.insuranceData?.idSeguro || !idProduct) {
          throw new Error("Dados necessários não encontrados");
        }
        return downloadTicket({
          idSeguro: paymentStates.insuranceData.idSeguro.toString(), 
          idProduct: idProduct
        });
      },
      onSuccess: (data) => {
        console.log("data", data)
        toast.success("Bilhete gerado com sucesso");
        console.log("data", data)
      },
      onError: (error) => {
        console.log("error", error)
        toast.error("Erro ao gerar bilhete: \n" + JSON.stringify(error));
      }
    })

    useEffect(()=>{
      if(paymentMethodsData && isSuccess){
        console.log("paymentMethods", paymentMethodsData)
        setPaymentMethods(paymentMethodsData);
      }
    }, [paymentMethodsData, isSuccess])

    useEffect(()=>{
      if(isError){
        console.log("error", error)
      }  
    }, [isError, error])

    useEffect(()=>{
      console.log("paymentMethod", paymentMethodSelected)
      if(paymentMethodSelected?.chPagamento === "pix"){
        setPaymentStates((prev)=>{
          if(!prev) return {
            paymentTab: "internal",
            paymentMethod: "pix",
            paymentStatus: null,
            paymentSuccess: false,
          };
          return {
            ...prev,
            paymentMethod: "pix",
          }
        })
      }else if(paymentMethodSelected?.chPagamento === "cartao"){
        setPaymentStates((prev)=>{
          if(!prev) return {
            paymentTab: "internal",
            paymentMethod: "cartao",
            paymentStatus: null,
            paymentSuccess: false,
          };
          return {
            ...prev,
            paymentMethod: "cartao",
          }
        })
      } else if(paymentMethodSelected?.chPagamento === "boleto"){
        setPaymentStates((prev)=>{
          if(!prev) return {
            paymentTab: "internal",
            paymentMethod: "boleto",
            paymentStatus: null,
            paymentSuccess: false,
          };
          return {
            ...prev,
            paymentMethod: "boleto",
          }
        })
      }

    }, [paymentMethodSelected, setPaymentStates])

    return (
    <div className="space-y-8">
      {/* Status da conexão WebSocket */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Conectado ao servidor de pagamento' : 'Desconectado do servidor de pagamento'}
        </span>
      </div>

      {
        paymentStates?.paymentSuccess ? (
          <div>
            <h1 className="text-2xl font-bold mb-3">Pagamento concluído com sucesso!</h1>
            <p className="text-base mb-6">Obrigado por utilizar nosso sistema de vendas! Sua compra foi gerada com sucesso. Você pode visualizar os detalhes da compra na seção de histórico de compras.</p>
            <Button variant="secondary" disabled={isPending} onClick={() => {
              downloadTicketMutate()
            }}>
              Baixar Bilhete
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            </Button>
          </div>
        ) : (
          <>
            <Label className="space-y-2">
              <span>Método de pagamento</span>
              <Select value={paymentMethodSelected?.chPagamento} onValueChange={(value: string) => {
                const selectedMethod = paymentMethods?.find(method => method.chPagamento === value);
                setPaymentMethodSelected(selectedMethod ?? null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {!isLoading && paymentMethods?.map((method: PaymentMethod) => (
                    <SelectItem key={method.tpPagamento} value={method.chPagamento}>{method.dsMeioPagamento}</SelectItem>
                  ))}
                  {
                    isLoading && (
                      <SelectItem value="loading">Carregando...</SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
            </Label>
            {
              (paymentMethodSelected?.chPagamento === "1" || paymentMethodSelected?.chPagamento === "2") && (
                <div>
                  <h1 className="mb-4">Dados do cartão</h1>
                  <CardForm FormConfig={paymentMethodSelected?.jsonConf} />
                </div>
              )
            }

            {
              paymentMethodSelected?.chPagamento === "boleto" && (
                <div>
                  <h1 className="mb-4">Dados do boleto</h1>
                  <div className="space-x-2 flex">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione as parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                        <SelectItem value="5">5x</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                        <SelectItem value="7">7x</SelectItem>
                        <SelectItem value="8">8x</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full max-w-[200px]">
                      Gerar boleto
                    </Button>
                  </div>
                </div>
              )
            }

            {
              paymentMethodSelected?.chPagamento === "4" && (
                <PixCopyPaste idPaymentMethod={paymentMethodSelected?.idOperacaoMeioPagamento} idSeguro={paymentStates?.insuranceData?.idSeguro.toString()} />
              )
            }

            {
              paymentMethodSelected === null && (
                <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-sm w-full">
                  <h1>Selecione um método de pagamento</h1>
                </div>
              )
            }
          </>
        )
      }
    </div>
  );
}