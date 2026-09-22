import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SetStateAction, Dispatch, useState } from "react";
import { LuCopy, LuRefreshCcw, LuWifi, LuWifiOff } from "react-icons/lu";
import usePayWebSocket from "@/hooks/usePayWebSocket";
import { execApi } from "@/hooks/useApi";
import { downloadTicket } from "@/services/ticketService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LucideLoader2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { PaymentStatesType } from "@/hooks/ProductFormHook";

type PaymentSessionProps = {
  setPaymentStates: Dispatch<SetStateAction<PaymentStatesType | null>>
  paymentStates: PaymentStatesType | null
}

// Configuração do WebSocket
const WS_URL = import.meta.env.VITE_WS_PAYMENT_URL;

function formattedEventMessage(event: string) {
  switch (event) {
    case 'PAYMENT_SUCCESS':
      return 'Pagamento realizado';
    case 'PAYMENT_ERROR':
      return 'Erro no pagamento';
    case 'ENTERED_SUMMARY':
      return 'Entrou na tela de resumo';
    case 'CLICKED_PROCEED':
      return 'Clicou em prosseguir para o pagamento';
    case 'PAYMENT_METHOD_CHANGED':
      return 'Método de pagamento alterado';
    case 'DATA_FILLED':
      return 'Dados preenchidos';
    case 'CLICKED_PAY':
      return 'Clicou em pagar';
    default:
      return event;
  }
}

export default function ExternalPayLink({ setPaymentStates, paymentStates }: Readonly<PaymentSessionProps>) {
  const [link, setLink] = useState("");
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [open, setOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [device2Events, setDevice2Events] = useState<string[]>([]);
  

  // Hook WebSocket
  const {
    isConnected,
    isConnecting,
    error: wsError,
    connect: wsConnect,
    disconnect: wsDisconnect
  } = usePayWebSocket({
    url: WS_URL,
    roomId: paymentStates?.insuranceData?.idSeguro.toString(),
    onConnect: () => {
      console.log('🎉 WebSocket conectado e pronto para receber eventos do Device 2');
    },
    onDisconnect: () => {
      console.log('🔌 WebSocket desconectado');
    },
    onError: (error) => {
      console.error('❌ Erro no WebSocket:', error);
    },
    onRoomJoined: (event) => {
      console.log('🏠 Entrou na sala de pagamento:', event.payload.roomId);
    },
    onDevice2Event: (event) => {
      console.log('📱 Evento recebido do Device 2:', event.type, event.payload);
      
      // Adiciona o evento à lista para exibição
      setDevice2Events(prev => [...prev, `[AÇÃO DETECTADA]: ${formattedEventMessage(event.type)}`]);
      
      // Processa eventos específicos
      switch (event.type) {
        case 'PAYMENT_SUCCESS':
          console.log('✅ Pagamento realizado com sucesso pelo Device 2!');
          setPaymentSuccess(true);
          setPaymentStates((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              paymentStatus: "paid",
              paymentSuccess: true,
            }
          });
          break;
        
        case 'PAYMENT_ERROR':
          console.log('❌ Erro no pagamento pelo Device 2:', event.payload.error);
          break;
        
        case 'ENTERED_SUMMARY':
          console.log('📋 Device 2 entrou na tela de resumo');
          break;
        
        case 'CLICKED_PROCEED':
          console.log('➡️ Device 2 clicou em prosseguir');
          break;
        
        case 'PAYMENT_METHOD_CHANGED':
          console.log('💳 Device 2 alterou método de pagamento');
          break;
        
        case 'DATA_FILLED':
          console.log('📝 Device 2 preencheu todos os dados');
          break;
        
        case 'CLICKED_PAY':
          console.log('💸 Device 2 clicou em pagar');
          break;
      }
    }
  });

  const { mutate: downloadTicketMutation, isPending: isDownloadingTicket } = useMutation({
    mutationKey: ["downloadTicket"],
    mutationFn: async () => {
      if(!paymentStates?.insuranceData?.idSeguro || !paymentStates?.insuranceData?.idSegurado){
        throw new Error("Id do seguro ou id do produto não encontrado");
      }
      return await downloadTicket({ idSeguro: paymentStates?.insuranceData?.idSeguro.toString(), idProduct: paymentStates?.insuranceData?.idSegurado.toString() });
    },
    onSuccess: (data) => {
      console.log("bilhete baixado com sucesso");
      console.log(data);
      toast.success("Bilhete gerado com sucesso");
    },
    onError: (error) => {
      console.error("erro ao baixar bilhete", error);
      toast.error("Erro ao gerar bilhete");
    }
  })

  const handleGenerateLink = async () => {
    console.log("gerando link...");

    const res: any = await execApi({
      url: "api/crm/payment/public/generate/shortlink",
      method: "POST",
      data: {
        idSeguro: paymentStates?.insuranceData?.idSeguro,
      },
      isCrmApi: true,
    })

    if(res.data.codigo !== 0){
      console.log("erro ao gerar link");
      return;
    }

    const link = res.data.urlshort;

    setLink(link);
    setIsLinkExpired(false);
    setPaymentSuccess(false);
    setDevice2Events([]); // Limpa eventos anteriores
  }

  const handleDownloadPolicy = () => {
    downloadTicketMutation();
  }



  return (
    <div>
      {
        paymentStates?.paymentSuccess ? (
          <div>
            <h1 className="text-2xl font-bold mb-3">Pagamento concluído com sucesso!</h1>
            <p className="text-base mb-6">Obrigado por utilizar nosso sistema de vendas! Sua compra foi gerada com sucesso. Você pode visualizar os detalhes da compra na seção de histórico de compras.</p>
            <Button onClick={handleDownloadPolicy} variant="outline" disabled={isDownloadingTicket}>Baixar bilhete {isDownloadingTicket && <LucideLoader2 className="animate-spin" />}</Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-3">Gerar link de pagamento</h1>
            <p className="text-base mb-6">Será enviado por e-mail, a apólice para você e o segurado após compensação. A cobertura de Acidentes Pessoais estará garantida pela AKAD Seguros no período de vigência, Início às 00:00 de 15/03/2025 até ás 23:59 de 15/03/2026.</p>
          </>
        )
      }
      <Dialog open={open} onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setIsLinkExpired(false);
          setLink("");
          wsDisconnect();
          setDevice2Events([]);
        }else{
          wsConnect();
          handleGenerateLink();
        }
      }}>
        {
          !paymentStates?.paymentSuccess && (
            <DialogTrigger asChild>
              <Button>Gerar link</Button>
            </DialogTrigger>
          )
        }
        <DialogContent hasCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Link de pagamento</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          
          {/* Status do WebSocket */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-zinc-200 dark:bg-zinc-800">
            {isConnected ? (
              <>
                <LuWifi className="text-green-500" />
                <span className="text-sm text-green-600">Conectado ao servidor</span>
              </>
            ) : isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-500"></div>
                <span className="text-sm text-blue-600 dark:text-blue-500">Conectando...</span>
              </>
            ) : (
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <LuWifiOff className="text-red-700 dark:text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-500">Desconectado</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => wsConnect()} className="aspect-square" size="icon"><LuRefreshCcw className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Reconectar
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {wsError && (
              <span className="text-xs text-red-700 dark:text-red-500 ml-2">Erro: {wsError}</span>
            )}
          </div>

          {
            isLinkExpired && !paymentSuccess && (
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col border border-red-500 p-3 bg-red-500/10 rounded-md">
                  <p className="text-red-500 font-bold">Link de pagamento expirado</p>
                  <p>O link expirou. Clique no botão abaixo para gerar um novo link.</p>
                </div>
                <Button onClick={handleGenerateLink}>Gerar novo link</Button>
              </div>
            )
          }

          {
            !isLinkExpired && !paymentSuccess && (
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-row gap-x-2">
                  <Input type="text" value={link} readOnly className={`w-full max-w-md ${isLinkExpired ? "cursor-not-allowed" : ""}`} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="aspect-square w-10" size="icon" onClick={() => copyToClipboard(link)} disabled={isLinkExpired}>
                        <LuCopy />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Copiar link
                    </TooltipContent>
                  </Tooltip>
                </div>

                <CancelOperationDialog onConfirmCancel={() => {
                  wsDisconnect();
                  setDevice2Events([]);
                  setOpen(false);
                }} />

                {/* Lista de eventos do Device 2 */}
                {device2Events.length > 0 && (
                  <div className="border rounded-md p-3 bg-zinc-200 dark:bg-zinc-800">
                    <h4 className="font-semibold text-sm mb-2">Atividade do segurado:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {device2Events.map((event, index) => (
                        <div key={`${index}-event`} className="text-xs text-zinc-700 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 p-1 px-2 rounded">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* botao provisorio que efetua pagamento */}
              </div>
            )
          }

          {
            paymentSuccess && (
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col border border-green-500 p-3 bg-green-500/10 rounded-md">
                  <p className="text-green-500 font-bold text-lg mb-1">Pagamento efetuado com sucesso</p>
                  <p>O pagamento foi efetuado com sucesso. O mutuário receberá a apólice por e-mail.</p>
                  <div className="flex flex-row gap-x-2 items-center justify-end mt-4 w-full">
                    <Button onClick={handleDownloadPolicy} disabled={isDownloadingTicket}>Baixar bilhete {isDownloadingTicket && <LucideLoader2 className="animate-spin" />}</Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
                  </div>
                </div>
              </div>
            )
          }

        </DialogContent>
      </Dialog>
    </div>
  );
}

type CancelOperationDialogProps = {
  onConfirmCancel: () => void;
}

function CancelOperationDialog({ onConfirmCancel }: Readonly<CancelOperationDialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Cancelar operação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar operação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar a operação?
          </DialogDescription>
        </DialogHeader>
        <p>Se a operação for cancelada, desconectaremos você do servidor de pagamento e o não será mais possível rastrear a transação do seguro.</p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={onConfirmCancel}>Cancelar operação</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}