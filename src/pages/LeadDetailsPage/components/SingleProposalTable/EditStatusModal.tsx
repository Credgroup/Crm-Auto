import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { execApi } from "@/hooks/useApi";
import useDominios from "@/hooks/useDominios";
import { dev_log } from "@/lib/utils";
import { Dominio } from "@/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { LucideEdit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "sonner";

type EditStatusModalProps = {
    idProposta?: string;
}

export default function EditStatusModal({idProposta} : Readonly<EditStatusModalProps>){

    const { data, isSuccess} = useDominios({nmDominio: ["cdStatusProposta"]})
    const [open, setOpen] = useState(false)
    const [dsObs, setDsObs] = useState("")
    const [statusArr, setStatusArr] = useState<Dominio[]>([])
    const [statusSelect, setStatusSelect] = useState<Dominio | null>(null)

    useEffect(()=>{
        if(isSuccess && data){
            setStatusArr(data[0])
        }
    }, [isSuccess, data])

    const {mutate, isPending} = useMutation({
        mutationKey: [],
        mutationFn: async () => {   
            if(!dsObs.trim() || !idProposta || !statusSelect){
                throw new Error("Preencha todos os campos")
            }

            const res: any = await execApi({
                url: "api/crm/proposal/update/status",
                method: "PUT",
                data: {
                    idProposta, 
                    cdStatusProposta: statusSelect?.idchave,
                    dsObs
                },
                isCrmApi: true
            })

            dev_log(()=>{console.log(res)})

            if(!res.data.sucesso){
                throw new Error(res.data.mensagem)
            }

            return res.data

        },
        onSuccess: () => {
            toast.success("Status trocado com sucesso!")
            setOpen(false)
        },
        onError: (error) => {
            toast.error("Aconteceu algum problema:\n" + error.message)
        }
    })

    const handleSubmit = () =>{
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={(open)=>{
            setOpen(open)
            if(open){
                setStatusSelect(null)
                setDsObs("")
            }
        }}>
            <DialogTrigger asChild>
                <Button className="aspect-square" variant="secondary" size="icon">
                    <LucideEdit2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar status</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>
                <Label className="flex flex-col">
                    <span className="mb-3">Status</span>
                    <Select onValueChange={(e)=>{
                        setStatusSelect(JSON.parse(e) as Dominio)
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="selecione um valor"/>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                statusArr.length > 0 && statusArr.map((item) => (
                                    <SelectItem key={item.iddominio} value={JSON.stringify(item)}>{item.dschave}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </Label>
                <Label className="flex flex-col">
                    <span className="mb-3">Observação</span>
                    <Textarea onChange={(e)=> setDsObs(e.target.value)} value={dsObs} placeholder="Digite sua observação" className="resize-none h-20"  />
                </Label>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        Editar
                        {
                            isPending && (
                                <LuLoaderCircle className="animate-spin" />
                            )
                        }
                    </Button>
            </DialogContent>
        </Dialog>
    )
}