import { useState } from "react";
import { useSingleProposalColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { execApi } from "@/hooks/useApi";
import { Proposal } from "@/types";
import { DataTable } from "@/components/DataTable/DataTable";

type SingleProposalTableProps = {
  id: string;
};

export default function SingleProposalTable({
  id,
}: Readonly<SingleProposalTableProps>) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 6;

  const { data, isError, isFetching } = useQuery({
    queryKey: ["fetchSingleProposalTable", pageIndex],
    queryFn: () => fetchSingleProposal(pageIndex, pageSize, id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const columns = useSingleProposalColumns();

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      filter={["idProposta", "nmProposta", "idProduto"]}
      error={isError}
      loading={isFetching}
    />
  );
}

type ProposalResponse = {
  items: Partial<Proposal>[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

async function fetchSingleProposal(
  pageIndex: number,
  pageSize: number,
  id: string | null
): Promise<ProposalResponse> {
  if (!id) {
    toast.error("Selecione uma operação para buscar as proposatas");
    console.log(id, pageIndex, pageSize);
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
  try {
    const res: any = await execApi({
      url: `api/crm/proposal/find/${id}`,
      method: "GET",
      isCrmApi: true,
      data: {},
      needLogout: true,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar as propostas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
}
