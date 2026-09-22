import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ComissionProcessed } from "../ProcessedComissionTable";
import { LucideEye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dev_log } from "@/lib/utils";

export default function ProcessedComissionDetailsModal({ comission }: { comission: ComissionProcessed }) {

    let dtVigenciaInicio = "--"
    let dtVigenciaFim = "--"
    let dtCadastro = "--"
    let dtAlteracao = "--"

    try {
        dtVigenciaInicio = format(new Date(comission.dtVigenciaInicio), 'dd/MM/yyyy HH:mm:ss')
        dtVigenciaFim = format(new Date(comission.dtVigenciaFim), 'dd/MM/yyyy HH:mm:ss')
        dtCadastro = format(new Date(comission.dtCadastro), 'dd/MM/yyyy HH:mm:ss')
        dtAlteracao = format(new Date(comission.dtAlteracao), 'dd/MM/yyyy HH:mm:ss')
    } catch {
        dev_log(()=>console.log("Erro ao formatar datas", comission))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                    <LucideEye />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[60vw] max-w-none">
                <DialogHeader>
                    <DialogTitle>Detalhes da comissão</DialogTitle>
                    <DialogDescription>Comissão: {comission.nmComissao} | ID: {comission.idComissao}</DialogDescription>
                </DialogHeader>
                    <ScrollArea className="h-[63vh]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Nome Comissão</Label>
                                <p className="text-xl">{comission.nmComissao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">ID Mov</Label>
                                <p className="text-xl">{comission.idMovComissao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Data Vigência Início</Label>
                                <p className="text-xl">{dtVigenciaInicio}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Data Vigência Fim</Label>
                                <p className="text-xl">{dtVigenciaFim}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">ID Comissão</Label>
                                <p className="text-xl">{comission.idComissao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">ID Comissão Versão</Label>
                                <p className="text-xl">{comission.idComissaoVersao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">ID Operação</Label>
                                <p className="text-xl">{comission.idOperacao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Valor Base</Label>
                                <p className="text-xl">{comission.vlBaseTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Valor Comissão</Label>
                                <p className="text-xl">{comission.vlComissaoTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">ID Usuário</Label>
                                <p className="text-xl">{comission.idUsuario}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Tipo Status Comissão</Label>
                                <p className="text-xl">{comission.tpStatusComissao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Descrição Status Comissão</Label>
                                <p className="text-xl">{comission.dsStatusComissao}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Data Cadastro</Label>
                                <p className="text-xl">{dtCadastro}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Data Alteração</Label>
                                <p className="text-xl">{dtAlteracao}</p>
                            </div>
                        </div>
                    </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}