import GenericTabs, { TabItem } from "@/components/TabsGeneric";
import ShortlinkTab from "./Components/ShortlinkTab";
import { useState } from "react";
import { SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LuLink, LuMail } from "react-icons/lu";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { MdOutlineSms } from "react-icons/md";

interface Props {
  onSuccess?: (etapa: number) => void;
  idEmpresaOperacao?: string;
}

function EtapaContato({ onSuccess, idEmpresaOperacao }: Readonly<Props>) {
  const [tabsValue, setTabsValue] = useState("shortlink");

  const tabsCanais: TabItem[] = [
    {
      value: "shortlink",
      label: "Shortlink",
      icon: <LuLink />,
      content: <ShortlinkTab proposalId={idEmpresaOperacao} />
    },
    {
      value: "whats",
      label: "WhatsApp",
      icon: <AiOutlineWhatsApp />,
      disabled: false,
      content: <>Em desenvolvimento</>
    },
    {
      value: "email",
      label: "Email",
      icon: <LuMail />,
      disabled: false,
      content: <>Em desenvolvimento</>
    },
    {
      value: "sms",
      label: "SMS",
      icon: <MdOutlineSms />,
      disabled: false,
      content: <>Em desenvolvimento</>
    }
  ];

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg gap-10 h-[calc(100vh-6em)]">
      <div className="space-y-14 w-full max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl  text-center">
            Enviar proposta
          </SheetTitle>
          <SheetDescription className="text-md  text-center">
            Selecione o meio de contato com o lead{" "}
          </SheetDescription>
        </SheetHeader>

        <GenericTabs
          tabs={tabsCanais}
          value={tabsValue}
          onValueChange={setTabsValue}
          className="w-full"
        />
      </div>

      <SheetFooter className="flex flex-col w-full max-w-lg">
        {tabsValue === "shortlink" ? (
          <Button
            onClick={() => onSuccess?.(4)}
            className="w-full mt-4"
            variant="secondary"
          >
            Finalizar
          </Button>
        ) : (
          <>
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">
                Cancelar
              </Button>
            </SheetClose>
            <Button className="w-full" onClick={() => onSuccess?.(4)}>
              Enviar seguros
            </Button>
          </>
        )}
      </SheetFooter>
    </div>
  );
}

export default EtapaContato;
