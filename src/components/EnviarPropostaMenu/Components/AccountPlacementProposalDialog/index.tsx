import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { execApi } from "@/hooks/useApi";
import { cn, dev_log } from "@/lib/utils";
import { PlacementAccountProposalLinked } from "@/pages/LeadDetailsPage/components/PropostaModal/AgroupedProposals/AccountPlacementTab";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

type AccountPlacementProposalDialogProps = {
    idOperation: number | string | null,
    idSelected?: PlacementAccountProposalLinked[],
    idProposalGroup?: number | string | null,
    onSelected?: (id: number | string) => void
}

export default function AccountPlacementProposalDialog({idOperation, idSelected = [], onSelected, idProposalGroup} : Readonly<AccountPlacementProposalDialogProps>){
    
    const [tabList, setTabList] = useState<string[]>([])
    const [selectedUsers, setSelectedUsers] = useState<PlacementAccountProposal[]>([])
    const [open, setOpen] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const queryClient = useQueryClient()

    const {data, isSuccess, isError, error, isLoading} = useQuery({
        queryKey: ["fetchPlacementAccountProposal", idOperation],
        queryFn: () => fetchPlacementAccountProposalFn(idOperation),
        enabled: !!idOperation,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (user: PlacementAccountProposal)=>{
            try {
                if(!idProposalGroup){
                    throw new Error("idProposalGroup inválido!")
                }

                const res: any = await execApi({
                    url: `api/crm/user/link/proposalgroup`,
                    method: "POST",
                    data: {
                        idGrupoProposta: idProposalGroup,
                        idUsuarioInsert: user.idUsuario,
                        nmCargoProposta: user.nmCargo
                    },
                    isCrmApi: true
                })

                return res.data
            } catch (error) {
                throw error
            }
        },
        onError: (err: any) => {
            dev_log(()=>console.log(err))
            const msg = err.response.data.mensagem ?? null
            if(!msg) {
                toast.error("Aconteceu algum erro ao vincular participante")
            }
            toast.error(msg)
        }
    })

    useEffect(()=>{
        if(data && isSuccess){
            dev_log(()=>console.log(data))
            // lista de departamentos
            const deptList: string[] = []
            data.forEach(user => {
                if(!deptList.includes(user.nmDepartamento)){
                    deptList.push(user.nmDepartamento)
                }
            })
            setTabList(deptList)
        }
    }, [isSuccess, data])

    useEffect(()=>{
        if(error && isError){
            dev_log(()=>console.log(error))
        }
    }, [isError, error])

    // Limpar seleção quando o modal fechar
    useEffect(()=>{
        if(!open){
            setSelectedUsers([])
        }
    }, [open])

    function onSelectUser(userId: number){
        if(!data) {
            return
        }

        const getUser = data.find(user => user.idUsuario == userId)
        if(!getUser) return

        // Verificar se o usuário já está vinculado (em idSelected) - não pode ser desmarcado
        const isAlreadyLinked = idSelected && idSelected.some((u) => u.idUsuario === userId)
        if(isAlreadyLinked){
            // Não permitir desmarcar usuários já vinculados
            return
        }

        // Verificar se o usuário já está selecionado (em selectedUsers)
        const isAlreadySelected = selectedUsers.some(user => user.idUsuario === userId)
        
        if(isAlreadySelected){
            // Remover da seleção (apenas se não estiver vinculado)
            setSelectedUsers(prev => prev.filter(user => user.idUsuario !== userId))
            return
        }

        // Verificar se já existe um usuário com o mesmo nmCargo selecionado
        // Verificar tanto em selectedUsers quanto em idSelected
        const hasSameCargoInSelected = selectedUsers.some(user => user.nmCargo === getUser.nmCargo)
        const hasSameCargoInLinked = idSelected && idSelected.some(u => u.nmCargoProposta === getUser.nmCargo)
        if(hasSameCargoInSelected || hasSameCargoInLinked){
            // Não permitir seleção de usuário com mesmo cargo
            toast.error(`Já existe um usuário com o cargo "${getUser.nmCargo}" selecionado`)
            return
        }

        // Adicionar à seleção
        setSelectedUsers(prev => [...prev, getUser])
        onSelected?.(userId)
    }

    function handleLinkUserClick(){
        // Filtrar apenas os novos usuários selecionados (que não estão em idSelected)
        const usersToLink = selectedUsers.filter(
            user => !idSelected || !idSelected.some(u => u.idUsuario == user.idUsuario)
        )

        if(usersToLink.length === 0){
            toast.info("Nenhum novo usuário para vincular")
            setOpen(false)
            setSelectedUsers([])
            return
        }

        // Mostrar modal de confirmação
        setShowConfirmDialog(true)
    }

    async function handleConfirmLinkUser(){
        // Filtrar apenas os novos usuários selecionados (que não estão em idSelected)
        const usersToLink = selectedUsers.filter(
            user => !idSelected || !idSelected.some(u => u.idUsuario == user.idUsuario)
        )

        if(usersToLink.length === 0){
            toast.info("Nenhum novo usuário para vincular")
            setShowConfirmDialog(false)
            setOpen(false)
            setSelectedUsers([])
            return
        }

        // Processar todos os usuários
        try {
            await Promise.all(usersToLink.map(user => mutateAsync(user)))
            
            // Invalidar cache do AccountPlacementTab para recarregar dados atualizados
            if(idProposalGroup && idOperation){
                queryClient.invalidateQueries({
                    queryKey: ["fetchLinkedPlacementAcountProposal", idOperation, idProposalGroup]
                })
            }
            
            setShowConfirmDialog(false)
            setOpen(false)
            setSelectedUsers([])
            toast.success(`${usersToLink.length} ${usersToLink.length === 1 ? 'usuário vinculado' : 'usuários vinculados'} com sucesso!`)
        } catch (error) {
            dev_log(() => console.error("Erro ao vincular usuários:", error))
            setShowConfirmDialog(false)
        }
    }

    return (
      <>
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 justify-start text-left font-normal"
            >
              Selecione o participante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl flex flex-col items-center justify-center">
            <DialogTitle>Selecione o participante</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
            
            {
                isLoading && <LoaderCircle className="animate-spin" />
            }

            {
                !isLoading && data && tabList.length > 0 && ( 
                    <Tabs defaultValue={tabList[0]} className="w-full">
                    <TabsList className="w-full">
                        {
                            tabList.map(item =>(
                                <TabsTrigger key={v4()} value={item} className="flex-1">{item}</TabsTrigger>
                            ))
                        }
                    </TabsList>
                    {
                        tabList.map(dept =>(
                            <TabsContent value={dept} key={v4()}>
                                <Card>
                                    <CardContent className="p-3 space-y-2">
                                        {
                                            data.map(user =>{
                                                const isSelected = selectedUsers.some(selected => selected.idUsuario === user.idUsuario)
                                                const isAlreadyLinked = idSelected && idSelected.some(u => (u.idUsuario === user.idUsuario))
                                                // Verificar se já existe outro usuário com o mesmo cargo selecionado
                                                const hasSameCargoSelected = selectedUsers.some(selected => selected.nmCargo === user.nmCargo && selected.idUsuario !== user.idUsuario)
                                                // Verificar se já existe um usuário vinculado com o mesmo cargo
                                                const hasSameCargoLinked = idSelected && idSelected.some(u => u.nmCargoProposta === user.nmCargo && u.idUsuario !== user.idUsuario)
                                                // Desabilitar se: já está vinculado OU (já tem outro com mesmo cargo selecionado E este não está selecionado) OU (já tem outro vinculado com mesmo cargo)
                                                const isDisabled = isAlreadyLinked || (hasSameCargoSelected && !isSelected) || (hasSameCargoLinked && !isSelected)
                                                
                                                return user.nmDepartamento == dept && (
                                                    <div className={cn("flex items-center justify-between border rounded-md p-1 px-2", isDisabled ? 'opacity-50 cursor-not-allowed' : 'bg-muted/30')} key={user.idUsuario}>
                                                        <Label className={`flex items-center gap-4 flex-1 cursor-pointer py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                            <Checkbox
                                                                onCheckedChange={()=>onSelectUser(user.idUsuario)}
                                                                checked={isSelected || isAlreadyLinked}
                                                                disabled={isDisabled}
                                                            />
                                                            <p className="font-semibold">{user.nmUsuario}</p>
                                                        </Label>
                                                        <Badge>{user.nmCargo}</Badge>
                                                    </div>
                                                )
                                            })
                                        }
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))
                    }
                    </Tabs>
                )
            }
            <DialogFooter className=" w-full">
                <Button onClick={handleLinkUserClick} disabled={selectedUsers.length === 0 || isPending}>
                    {isPending ? "Vinculando..." : "Vincular"}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmação de vinculação */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar vinculação</DialogTitle>
              <DialogDescription>
                {(() => {
                  const usersToLink = selectedUsers.filter(
                    user => !idSelected || !idSelected.some(u => u.idUsuario == user.idUsuario)
                  )
                  const count = usersToLink.length
                  return `Tem certeza que deseja vincular ${count} ${count === 1 ? 'usuário' : 'usuários'} à proposta?`
                })()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Não</Button>
              </DialogClose>
              <Button onClick={handleConfirmLinkUser} disabled={isPending}>
                {isPending ? "Vinculando..." : "Sim"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
}

export type PlacementAccountProposal = {
  idUsuario: number;
  nmUsuario: string;
  nmCargo: string;
  idCargo: number;
  nmDepartamento: string;
  idDepartamento: number;
}

async function fetchPlacementAccountProposalFn(id: number | string | null){
    try{
        const res: any = await execApi({
            url: `api/crm/user/operation/${id}`,
            method: "GET",
            data: {},
            isCrmApi: true,
            needLogout: true
        }) 

        if("sucesso" in res.data) {
            throw new Error(res.data.mensagem)
        }

        return res.data as PlacementAccountProposal[]
    }catch(e){
        throw e
    }
}