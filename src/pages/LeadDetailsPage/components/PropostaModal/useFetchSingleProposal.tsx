import { execApi } from "@/hooks/useApi";
import { dev_log } from "@/lib/utils";
import { Proposal } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useFetchSingleProposal({ fetchSingleProposal, id, modalOpen }: { fetchSingleProposal: boolean, id: string, modalOpen: boolean }) {
    return useQuery({
        queryKey: ["fetchSingleProposal", id],
        queryFn: () => fetchSingleProposalFn(id),
        enabled: fetchSingleProposal && !!id && modalOpen,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
    });
}

async function fetchSingleProposalFn(id: string) {
    try {

        if(!id){
            throw new Error("Id da proposta não encontrado")
        }
        
        const res: any = await execApi({
            url: `api/crm/proposal/find/unique/${id}`,
            method: "GET",
            isCrmApi: true,
            data: {},
            needLogout: true,
        });

        dev_log(()=>console.log(res))

        if("sucesso" in res.data){
            throw new Error(res.data.mensagem)
        }

        return res.data as Partial<Proposal>

    } catch (error) {
        dev_log(()=>console.log(error))
        throw error
    }
}