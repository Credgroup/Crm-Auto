import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MfaInstructionsDialogProps {
  alradyScan: boolean;
}

export function MfaInstructionsDialog({
  alradyScan,
}: Readonly<MfaInstructionsDialogProps>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-2 inline-block text-blue-500">
          Ver passo a passo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Passo a passo</DialogTitle>
        </DialogHeader>
        <ol className="list-decimal list-inside text-base space-y-2">
          {alradyScan ? (
            <>
              <li>Instale o app Google Authenticator no seu celular</li>
              <li>
                Abra o app, toque no símbolo de "+" e escolha "Ler um QR code"
              </li>
              <li>Aponte a câmera do seu celular para o QR code na tela</li>
              <li>Digite o código gerado no aplicativo abaixo</li>
            </>
          ) : (
            <>
              <li>Acesse o app Google Authenticator no seu dispositivo</li>
              <li>Digite o código que está aparecendo no app</li>
            </>
          )}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
