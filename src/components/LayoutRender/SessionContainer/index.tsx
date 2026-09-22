import type { FieldType, SessaoType } from "@/types";
import GenericField from "../GenericField";
import { v4 as uuidv4 } from "uuid";
import SessionDisplayContainer from "../SessionDisplayContainer";
import PaymentSession from "../PaymentSession";
import CotacaoSession from "../CotacaoSession";
import ProductPresentationSession from "../ProductPresentationSession";
import { PaymentStatesType } from "@/hooks/ProductFormHook";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";

type SessionContainerProps = {
  fields: Partial<FieldType>[];
  error?: string | null;
  typeSession?: SessaoType["typeSession"];
  allSessions?: Partial<SessaoType>[] | null;
  handleSelectSessao?: (session: Partial<SessaoType>) => void;
  paymentStates: PaymentStatesType | null;
  setPaymentStates: Dispatch<SetStateAction<PaymentStatesType | null>> 
  idProduct?: string | null;
  updateFieldValue?: (targetName: string, newValue: string) => void;
  updateNormalField?: (campoApi: string, newValue: string) => void;
};
export default function SessionContainer({
  fields,
  error,
  typeSession = "input",
  allSessions,
  handleSelectSessao,
  paymentStates,
  setPaymentStates,
  idProduct,
  updateFieldValue,
  updateNormalField
}: Readonly<SessionContainerProps>) {

  const handleFieldUpdate = useCallback((targetName: string, newValue: string) => {
    console.log(`[SessionContainer] handleFieldUpdate: targetName="${targetName}", newValue="${newValue}"`);
    updateFieldValue?.(targetName, newValue);
  }, [updateFieldValue]);

  const handleValueChange = useCallback((campoApi: string, value: any) => {
    updateNormalField?.(campoApi, value);
  }, [updateNormalField]);

  // Memoiza os campos para evitar re-renderizações desnecessárias
  const memoizedFields = useMemo(() => fields, [fields]);

  // Memoiza os callbacks para cada campo para evitar re-criações
  const fieldCallbacks = useMemo(() => {
    return memoizedFields.reduce((acc, campo) => {
      acc[campo.campoApi!] = (value: any) => {
        handleValueChange(campo.campoApi!, value);
      };
      return acc;
    }, {} as Record<string, (value: any) => void>);
  }, [memoizedFields, handleValueChange]);

  if (typeSession !== "input") {

    if (typeSession === "apresentacao") {
      return (
        <div className="w-full">
          <ProductPresentationSession idProduct={idProduct} />
        </div>
      );
    }

    if (typeSession === "pagamento") {
      return (
        <div className="w-full">
            <PaymentSession paymentStates={paymentStates} setPaymentStates={setPaymentStates} idProduct={idProduct}/>
        </div>
      );
    }

    if (typeSession === "cotacao") {
      return (
        <div className="w-full">
          <CotacaoSession allSessions={allSessions} updateNormalField={updateNormalField} idProduct={idProduct} />
        </div>
      );
    }

    return (
      <div className="w-full">
        {allSessions?.map(
          (item) =>
            (item.typeSession === "input" || item.typeSession === "documento") && (
              <SessionDisplayContainer
                key={uuidv4()}
                resumeSession={item}
                handleSelectSessao={handleSelectSessao}
              />
            )
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        {memoizedFields.map((campo) => (
           <GenericField 
             field={campo} 
             key={campo.campoApi || `field-${campo.nome}`} 
             restFields={memoizedFields}
             onValueChange={fieldCallbacks[campo.campoApi!]}
             onFieldUpdate={handleFieldUpdate}
           />
         ))}
      </div>
      {error && (
        <div className="bg-red-500/20 border py-3 px-4 rounded-md border-red-500/20 font-semibold col-span-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
