import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { columnsEnvio, Envio } from "./EnviosListColumns";

const data: Envio[] = [
  {
    idseguradomulticanal: 2185,
    idoperacaomulticanal: 2011,
    idseguradoi2k: 2025,
    idcontato: 0,
    idemail: 1039,
    tpstatus: 1243,
    status: "Sucesso",
    chstatus: "1",
    idexterno: "0",
    mensagem: "Tempo de armazenamento expirado",
    assunto: "DILMA CATUREBA não perca a chance!",
    jsonenvio:
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n  <head>\n    <title>Systemcred\n    </title>\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  </head>\n  <body />\n  <table width="100%" cellspacing="0" cellpadding="0" border="0">\n    <tbody>\n      <tr>\n        <td align="center">\n          <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">\n            <tbody>\n              <tr>\n                <td style="padding: 0px 0px 0px 0px; border-bottom: 0px solid #00123c !important; border-top: 0px solid #00123c !important;" valign="top" bgcolor="#00123c" align="center">\n                  <div class="m_-7125233728050563540he-col m_-7125233728050563540he-last" style="margin: 0; display: table-cell; vertical-align: top; width: 600px;">\n                    <table class="m_-7125233728050563540he-col" style="margin: 0; width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n                      <tbody>\n                        <tr>\n                          <td align="center">\n                            <table width="100%">\n                              <tbody>\n                                <tr>\n                                  <td style="padding: 0px;" align="center">\n                                    <table class="m_-7125233728050563540he-image" cellspacing="0" cellpadding="0" border="0" align="center">\n                                      <tbody>\n                                        <tr>\n                                          <td style="padding: 0px 0px 0px 0px;">\n                                            <img\n src="http://syconnect.com.br/media/images/Bradesco/Frame_Bradesco_03.jpg" alt="" title="" style="                                                                                                max-width: 100%;                                                                                                float: none !important;                                                                                                border: 0;                                                                                                line-height: 100%;                                                                                                outline: none;                                                                                                text-decoration: none;                                                                                                width: 100%;                                                                                                display: block;                                                                                                height: auto;                                                                                            " class="CToWUd a6T" tabindex="0" width="600" />\n                                            <div class="a6S" dir="ltr" style="opacity: 0.01; left: 552px; top: 385.5px;">\n                                              <div\n id=":p3" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Fazer o download do anexo " data-tooltip-class="a1V" data-tooltip="Fazer o download" />\n                                              <div class="wkMEBb">\n                                                <div class="aSK J-J5-Ji aYr">\n                                                </div>\n                                              </div>\n                                            </div>\n                                      </div>\n                                      </td>\n                                </tr>\n                              </tbody>\n                            </table>\n                          </td>\n                        </tr>\n                      </tbody>\n                    </table>\n                    <table width="100%" cellspacing="0" cellpadding="0" border="0">\n                      <tbody>\n                        <tr>\n                          <td style="line-height: 1.2 !important; padding: 45px 120px 0px 120px; font-size: 14px; font-family: arial, helvetica, sans-serif;">\n                            <p style="margin: 0; line-height: inherit !important;">\n                              <span style="font-family: roboto, sans-serif;">\n                                <span style="color: #ffffff;">\n                                  <span style="font-size: 18px;">Olá, DILMA CATUREBA !\n                                    <br />\n                                    <br />\n                                  </span>\n                                </span>\n                              </span>\n                            </p>\n                            <p style="margin: 0; line-height: inherit !important;">\n                              <span style="font-family: roboto, sans-serif;">\n          ',
    jsonretorno: "E-mail enviado com sucesso",
    dtenvio: "17/12/2021 19:10:55",
    tpstatuscallback: "2145",
    chstatuscallback: "2",
    dsstatuscallback: "Recebido",
    tpmulticanal: 1229,
    chmulticanal: "2",
    dsmulticanal: "Email",
    nmhtml: "",
    nmsms: "",
    ddd: "",
    telefone: "",
    email: "itamar.soares@credgroup.com.br",
    cadastro: "2021-12-17T18:54:36.453",
    alteracao: "2021-12-20T11:28:37.75",
  },
];

function EnviosModal() {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger className="w-full" asChild>
              <Button size="icon" variant="ghost">
                <Send className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Envios</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Envios</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <DataTable
            columns={columnsEnvio}
            data={data}
            filter={["idExterno"]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EnviosModal;
