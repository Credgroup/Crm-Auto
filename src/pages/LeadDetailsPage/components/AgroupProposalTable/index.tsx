import { DataTable } from "@/components/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAgroupProposalColumns } from "./columns";
import { toast } from "sonner";
import { execApi } from "@/hooks/useApi";
import { ProposalGroup } from "@/types";

type AgroupProposalTableProps = {
  id: string;
  needRefetch?: boolean;
};

export default function AgroupProposalTable({
  id,
  needRefetch
}: Readonly<AgroupProposalTableProps>) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 6;

  const { data, isError, isFetching, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["fetchAgroupProposalTable", pageIndex],
    queryFn: () => fetchGroupProposal(pageIndex, pageSize, id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const columns = useAgroupProposalColumns();

  useEffect(() => {
    refetch();
  }, [needRefetch]);

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      filter={["nome", "cpf", "idSeguradoI2k"]}
      error={isError}
      loading={isFetching ?? isRefetching ?? isLoading}
    />
  );
}

type ProposalResponse = {
  items: Partial<ProposalGroup>[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

async function fetchGroupProposal(
  pageIndex: number,
  pageSize: number,
  id: string | null
): Promise<ProposalResponse> {
  if (!id) {
    toast.error(
      "Selecione uma operação para buscar os agrupamentos de proposatas"
    );
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
  try {
    const res: any = await execApi({
      url: `api/crm/proposal/find/group/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: "GET",
      isCrmApi: true,
      data: {},
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar agrupamentos de propostas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
}
