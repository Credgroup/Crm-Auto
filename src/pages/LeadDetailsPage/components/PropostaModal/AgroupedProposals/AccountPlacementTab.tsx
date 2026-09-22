import AccountPlacementProposalDialog from "@/components/EnviarPropostaMenu/Components/AccountPlacementProposalDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { execApi } from "@/hooks/useApi";
import { dev_log } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { LuDelete } from "react-icons/lu";
import { toast } from "sonner";

type AccountPlacementProposalTabProps = {
    idProposalGroup?: string
}

export type PlacementAccountProposalLinked = {
    idUsuarioGrupoProposta: number;
    idGrupoProposta: string;
    idUsuario: number;
    nmUsuario: string;
    idUsuarioCargo: number;
    nmCargoProposta: string;
    dtCadastro: string;
}

export default function AccountPlacementProposalTab({idProposalGroup}: Readonly<AccountPlacementProposalTabProps>){
    const id = useOperationStore((state)=>state.idOperation)
    const queryClient = useQueryClient()
    const [userIdsAlreadySelected, setUserIdsAlreadySelected] = useState<PlacementAccountProposalLinked[]>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [userToDelete, setUserToDelete] = useState<PlacementAccountProposalLinked | null>(null)

    const {data, isLoading, isRefetching, isError, error} = useQuery({
        queryKey: ["fetchLinkedPlacementAcountProposal", id, idProposalGroup],
        queryFn: async () => {
            try {

                if(!idProposalGroup){
                    throw new Error("IdProposalGroup Inválido!")
                }
                
                const res: any = await execApi({
                    url: `api/crm/user/group/${idProposalGroup}`,
                    method: "GET",
                    data: {},
                    isCrmApi: true
                })

                if("sucesso" in res.data){
                    throw new Error(res.data.mensagem)
                }

                const users = res.data as PlacementAccountProposalLinked[]
                dev_log(()=>console.log(users))
                setUserIdsAlreadySelected(users)

                return users

            } catch (error: any) {
                throw error
            }
        },
        enabled: !!idProposalGroup && !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    })

    const {mutate, isPending} = useMutation({
        mutationFn: async (userIdSelected: string | number) =>{
            try {
                const res: any = await execApi({
                    url: `api/crm/user/link/proposalgroup/${userIdSelected.toString()}`,
                    data: {},
                    method: "DELETE",
                    isCrmApi: true
                })

                dev_log(()=>console.log(res.data))

                if("sucesso" in res.data && res.data.sucesso == false){
                    throw new Error(res.data.mensagem)
                }
            } catch (error: any) {
                throw new Error(error.response.data.mensagem ?? "Erro ao desvincular usuário!")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fetchLinkedPlacementAcountProposal", id, idProposalGroup]
            })
            toast.success("Usuário desvinculado com sucesso!")
        },
        onError: (err: any) =>{
            dev_log(()=>console.log(err))
            toast.error(err.message)
        }
    })

    function handleDeleteUserSelect(user: PlacementAccountProposalLinked){
        if(!user){
            return
        }

        setUserToDelete(user)
        setShowDeleteConfirm(true)
    }

    function handleConfirmDelete(){
        if(!userToDelete){
            return
        }

        mutate(userToDelete.idUsuarioGrupoProposta)
        setShowDeleteConfirm(false)
        setUserToDelete(null)
    }

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Participantes vinculados</h1>
            <div className="mb-4">
                {
                    !isLoading && !isRefetching && data && data.map(user => (
                        <div className="flex items-center justify-between gap-2" key={user.idUsuario}>
                            <Label className="flex items-center gap-4 flex-1 py-2">
                                <p className="font-semibold">{user.nmUsuario}</p>
                            </Label>
                            <div className="flex items-center gap-2">
                                <Badge>{user.nmCargoProposta}</Badge>
                            </div>
                            <Button variant="destructive" size='icon' onClick={() => handleDeleteUserSelect(user)} disabled={isPending}>
                                {
                                    isPending && <LoaderCircle className="animate-spin" />
                                }
                                {
                                    !isPending && <LuDelete />
                                }
                            </Button>
                        </div>
                    ))
                }
                {
                    isLoading || isRefetching && <div className="w-full h-10 bg-muted/60 animate-pulse rounded-md delay-200"></div>
                }
                {
                    !isLoading && !isRefetching && data && data.length === 0 && <p className="text-sm text-muted-foreground">Nenhum participante vinculado</p>
                }
                {
                    isError && !isRefetching && !isLoading && error && (
                        <div className="flex items-center justify-center w-full h-full">
                            <p className="text-sm text-red-500">{error.message}</p>
                        </div>
                    )
                }
            </div>
            <AccountPlacementProposalDialog 
                idOperation={id} 
                idSelected={userIdsAlreadySelected} 
                idProposalGroup={idProposalGroup}
            />

            {/* Dialog de confirmação de exclusão */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            {userToDelete && (
                                `Tem certeza que deseja desvincular o usuário "${userToDelete.nmUsuario}" da proposta? Esta ação não pode ser desfeita.`
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Não</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
                            {isPending ? "Desvinculando..." : "Sim"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}