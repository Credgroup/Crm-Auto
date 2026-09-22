import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import { Copy, FileCode, X } from "lucide-react";
import { useState } from "react";


type JsonEnvioRetornoModalProps = {
    jsonEnvio?: string | null;
    jsonRetorno?: string | null;
}

export default function JsonEnvioRetornoModal({ jsonEnvio, jsonRetorno }: Readonly<JsonEnvioRetornoModalProps>) {
    const [isOpen, setIsOpen] = useState(false);

    function handleFormatJson(json: string) {
        try {
            const jsonObject = JSON.parse(json);
            return JSON.stringify(jsonObject, null, 2);
        } catch (error) {
            // Se o JSON não for válido, retorna o texto original sem formatação
            console.warn('Erro ao formatar JSON:', error);
            return json;
        }
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="icon">
                    <FileCode />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90vw] h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Envio/Retorno</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>
                <div className="flex flex-row gap-4">
                    <div className="w-full">
                        <div className="w-full flex flex-row gap-2 items-center justify-between mb-2">
                            <h1 className="text-lg font-medium">Envio</h1>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" size="icon" className="aspect-square" disabled={!jsonEnvio} onClick={()=> copyToClipboard(jsonEnvio!)}>
                                        <Copy />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Copiar
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {
                            jsonEnvio ? (
                                <>
                                    <Textarea className="h-[500px]" value={handleFormatJson(jsonEnvio)} />
                                </>
                            ) : (
                                <div className="w-full h-[500px] flex items-center justify-center border rounded-md flex-col">
                                    <X />
                                    <h1 className="text-lg font-medium">Não há envio</h1>
                                </div>
                            )
                        }

                    </div>
                    <div className="w-full">
                        <div className="w-full flex flex-row gap-2 items-center justify-between mb-2">
                            <h1 className="text-lg font-medium">Retorno</h1>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" size="icon" className="aspect-square" disabled={!jsonRetorno} onClick={()=> copyToClipboard(jsonRetorno!)}>
                                        <Copy />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Copiar
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {
                            jsonRetorno ? (
                                <>
                                    <Textarea className="h-[500px]" value={handleFormatJson(jsonRetorno)} />
                                </>
                            ) : (
                                <div className="w-full h-[500px] flex items-center justify-center border rounded-md flex-col">
                                    <X />
                                    <h1 className="text-lg font-medium">Não há retorno</h1>
                                </div>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}