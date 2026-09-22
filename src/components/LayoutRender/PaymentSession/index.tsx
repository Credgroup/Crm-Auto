import { Button } from "@/components/ui/button";
import { SetStateAction, Dispatch, useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import ExternalPayLink from "./ExternalPayLink";
import { cn } from "@/lib/utils";
import { PaymentStatesType } from "@/hooks/ProductFormHook";

type PaymentSessionProps = {
  paymentStates: PaymentStatesType | null;
  setPaymentStates: Dispatch<SetStateAction<PaymentStatesType | null>>
  idProduct?: string | null;
}

export default function PaymentSession({ paymentStates, setPaymentStates, idProduct }: Readonly<PaymentSessionProps>) {
  const [paymentSessionType, setPaymentSessionType] = useState<"internal" | "external">(
    paymentStates?.paymentTab ?? "external"
  );

  // Sincroniza o estado local com o paymentStates
  useEffect(() => {
    if (paymentStates?.paymentTab && paymentStates.paymentTab !== paymentSessionType) {
      setPaymentSessionType(paymentStates.paymentTab);
    }
  }, [paymentStates?.paymentTab]);

  useEffect(()=>{
    if(paymentSessionType === "internal"){
      setPaymentStates((prev)=>{
        if(!prev) return {
          paymentTab: "internal",
          paymentMethod: "link",
          paymentStatus: null,
          paymentSuccess: false,
        };
        return {
          ...prev,
          paymentTab: "internal"
        }
      })
    }
    if(paymentSessionType === "external"){
      setPaymentStates((prev)=>{
        if(!prev) return {
          paymentTab: "external",
          paymentMethod: "link",
          paymentStatus: null,
          paymentSuccess: false,
        };
        return {
          ...prev,
          paymentTab: "external"
        }
      })
    }
  }, [paymentSessionType, setPaymentStates])
  return (
    <div className="w-full space-y-4">
      
        {
          !paymentStates?.paymentSuccess && (
            <div className="flex flex-row gap-x-4">
              <div className="relative flex justify-center items-center flex-col">
                <Button variant={"ghost"} className="mb-2" onClick={() => setPaymentSessionType("external")}>
                  Link de pagamento
                </Button>
                <div className={cn("w-0 h-[2px] bg-[var(--cor-principal)] transition-all duration-300", paymentSessionType === "external" && "w-full")}></div>
              </div>
              <div className="relative justify-center items-center flex-col hidden">
                <Button variant={"ghost"} className="mb-2" onClick={() => setPaymentSessionType("internal")} disabled>
                  Pagar agora
                </Button>
                <div className={cn("w-0 h-[2px] bg-[var(--cor-principal)] transition-all duration-300", paymentSessionType === "internal" && "w-full")}></div>
              </div>
            </div>
          )
        }



        <div className="w-full">
          {
            paymentSessionType === "internal" && (
              <PaymentForm setPaymentStates={setPaymentStates} paymentStates={paymentStates} idProduct={idProduct} />
            )
          }

          {
            paymentSessionType === "external" && (
              <ExternalPayLink setPaymentStates={setPaymentStates} paymentStates={paymentStates} />
            )
          }
        </div>

    </div>
  );
}