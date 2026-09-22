import { DataTable } from "@/components/DataTable/DataTable";
import { execApi } from "@/hooks/useApi";
import { usePartnerStore } from "@/store/partnerStore";
import { Proposal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import columnsProposalHistoric from "./ProposalHistoricColumns";

type ProposalHistoricTabProps = {
  id?: string;
  proposal: Partial<Proposal>;
};

const pageSize = 10

export default function ProposalHistoricTab({id}: Readonly<ProposalHistoricTabProps>){

    const [pageIndex, setPageIndex] = useState(0)

    const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["proposalHistoric", id],
    queryFn: () => getProposalHistoric({idProposta: id, pageSize, pageIndex: pageIndex + 1}),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  const idPartner = usePartnerStore((state) => state.partnerId)

  const title = idPartner === "39" ? "questionário de risco" : "proposta"

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error) {
      console.log(error.message);
    }
  }, [isError, error]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">
                    Historico {title}
                </h3>
            </div>

            <DataTable
                columns={columnsProposalHistoric}
                data={data?.items ?? []}
                pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                error={isError}
                loading={isLoading}
            />            
        </div>
    )
}

type GetProposalHistoricResponse = {
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    items: GetProposalHistoricItems[]
}

export type GetProposalHistoricItems = {
    idPropostaHistorico: number;
    idProposta: string;
    dtHistorico: string;
    nmEvento: string;
    tpMovimento: number;
    stMovimento: string;
    idUsuario: number;
    dsObs: string;
    dsMovimento: string
}

async function getProposalHistoric({idProposta, pageIndex, pageSize}:{idProposta?: string, pageSize: number, pageIndex: number}) {

    if(!idProposta && !pageIndex){
        throw new Error("IdProposta não identificado")
    }

    const res: any = await execApi({
        url: `api/crm/proposal/find/history/${idProposta}?pageNumber=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
        data: {},
        isCrmApi: true
    })

    console.log(res)

    if("sucesso" in res.data){
        throw new Error("Algum erro aconteceu na busca do histórico. \n\n" + res.data.mensagem)
    }

    return res.data as GetProposalHistoricResponse


}