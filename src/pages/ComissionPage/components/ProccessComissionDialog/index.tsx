import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ComissionFormated } from "../AvaliableComissionTable";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useOperationStore } from "@/store/operationStore";
import { execApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 } from "uuid";

export default function ProccessComissionDialog({ comission }: { comission: ComissionFormated }) {

    const idOperacao = useOperationStore(state => state.idOperation)
    const [open, setOpen] = useState(false)

    const [datesList] = useState(getYearsList(comission.dtProcessarDisponiveis))
    const [period, setPeriod] = useState<string>("")
    
    const { mutateAsync: processComission, isPending: isProcessingComission } = useMutation({
        mutationFn: async (params: any) => {
            const res: any = await execApi({
                url: `api/crm/commission/process`,
                method: "POST",
                data: params,
                isCrmApi: true
            })

            if(!res.data.sucesso){
                throw new Error(res.data.mensagem)
            }
            return res.data
        },
        onSuccess: (data: any) => {
            toast.success(data.mensagem)
            setOpen(false)
        },
        onError: (error: any) => {
            toast.error("Erro ao processar comissão. \n\n" + error.message)
        }
    })

    const handleProcessComission = () => {
        try {
            if(!period){
                throw new Error("Selecione o período de competência")
            }
            const date = `${format(new Date(period + "T00:00:00"), "MM-yyyy")}`
            const params = {
                mesProcessamento: date,
                idComissao: comission.idComissao,
                idComissaoVersao: comission.idComissaoVersao,
                idOperacao: idOperacao
            }
            processComission(params)
        } catch (error: any) {
            toast.error("Erro ao processar comissão. \n\n" + error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                    <Play />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Processar Comissão {comission.nmComissao}</DialogTitle>
                    <DialogDescription>
                        Essa comissão tem um período mensal, é necessário que selecione o mês de competência antes de processar
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {
                        datesList.length === 0 ? (
                            <div className="flex flex-col gap-2">
                                <div className="text-center bg-yellow-500/10 p-2 rounded-md">Não há períodos disponíveis para processamento</div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="month">Períodos disponíveis para processamento</Label>
                                <div className="flex gap-2">
                                    <Select value={period} onValueChange={setPeriod}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o período" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                datesList.length > 0 && datesList.map((dateItem) => {
                                                    try {
                                                        const dateFormated = format(new Date(dateItem + "T00:00:00"), "MMMM 'de' yyyy", { locale: ptBR })
                                                        return (
                                                            <SelectItem key={v4()} value={dateItem} className="flex !w-full flex-row justify-between">
                                                                <h1 className="capitalize">{dateFormated}</h1>
                                                            </SelectItem>
                                                        )
                                                    } catch {
                                                        return (
                                                            <SelectItem key={v4()} value={dateItem} className="flex !w-full flex-row justify-between">
                                                                <h1 className="capitalize">{dateItem}</h1>
                                                            </SelectItem>
                                                        )
                                                    }
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )
                    }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={() => handleProcessComission()} disabled={isProcessingComission || !period}>
                        {
                            isProcessingComission ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                "Processar"
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function getYearsList(dtMonthList?: string[]){
    try {
        if(!dtMonthList){
            return []
        }

        console.log(dtMonthList)
        const dates = dtMonthList
        return dates

    } catch (error) {
        console.log(error)
        return []
    }
}