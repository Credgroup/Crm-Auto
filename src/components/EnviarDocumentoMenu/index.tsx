import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";
import EtapaCanal from "./EtapaCanal";
import { Product, Enterprise } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { LuSend } from "react-icons/lu";
import EtapaTemplate from "./EtapaTemplate";
import EtapaDisparo from "./components/EtapaDisparo";

interface Props {
  ButtonType?: "text" | "icon";
  cliData?: Partial<Enterprise>;
  ButtonTrigger?: ReactNode;
  selectedProduct?: Partial<Product> | null;
  onClose?: () => void;
  documentLink?: string | null;
  documentName?: string | null;
  idEmpresa?: number | string
}

export function EnviarDocumentoMenu({
  onClose,
  documentLink = null,
  documentName = null,
  idEmpresa,
}: Readonly<Props>) {
  const [etapa, setEtapa] = useState(0);;
  const [open, setOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<{ type: string; contact: any } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);


  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if(!open) {
          onClose?.();
        }else {
          setEtapa(0);
          setSelectedChannel(null);
          setSelectedTemplate(null);
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon">
            <LuSend  />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[40%] h-screen p-0" hasCloseButton={false}>
        <SheetClose asChild>
          <Button variant="ghost" className="absolute top-4 right-4 z-10 aspect-square" size="icon">
            <X />
          </Button>
        </SheetClose>
        <ScrollArea className="w-full h-screen p-6">
          <div className="h-max w-full flex flex-col justify-center items-center">
            {etapa === 0 && (
              <EtapaCanal
                id={idEmpresa}
                onSuccess={(value, channel) => {
                  setSelectedChannel(channel ?? null);
                  setEtapa(value);
                }}
              />
            )}

            {etapa === 1 && (
              <EtapaTemplate
                selectedChannel={selectedChannel}
                navigateTabs={(value) => setEtapa(value)}
                onSuccess={(value, template) => {
                  setSelectedTemplate(template);
                  setEtapa(value);
                }}
              />
            )}

            {etapa === 2 && selectedChannel && selectedTemplate && (
              <EtapaDisparo
                selectedChannel={selectedChannel}
                selectedTemplate={selectedTemplate}
                documentLink={documentLink}
                documentName={documentName}
              />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
