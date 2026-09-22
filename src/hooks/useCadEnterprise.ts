import { toast } from "sonner";
import { execApi } from "./useApi";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import { Enterprise } from "@/types";
export const cadastrarEmpresa = async (
  data: Partial<Enterprise> & { adicional: any },
  idOperacao: string | null
) => {
  if (!idOperacao) {
    toast.error("Selecione uma operação para cadastrar empresa");
    return;
  }
  const cadEnterpriseParams = {
    idExterno: data.idExterno,
    nmFantasia: data.nmFantasia,
    nmRazaoSocial: data.nmRazaoSocial,
    nrCNPJ: data.nrCNPJ,
    nrInscricaoEstadual: data.nrInscricaoEstadual,
    tpCNPJ: data.tpCNPJ,
    dsEmail: data.dsEmail,
    nrDDD: data.nrDDD,
    nrTelefone: data.nrTelefone,
    adicional: data.adicional,
    idOperacao,
    cdStatus: "6",
  };
  console.log(cadEnterpriseParams);
  const res = await execApi<Partial<Enterprise>>({
    url: "api/crm/company/register/operation",
    data: cadEnterpriseParams,
    method: "POST",
    isCrmApi: true,
  });
  return res.data;
};

export const editarEmpresa = async (
  data: Partial<Enterprise> & { adicional: any }
) => {
  if (!Object.keys(data).length || !data.idEmpresaOperacao) {
    throw new Error(
      "IdEmpresaOperacao não encontrado ou dados vazios para editar empresa"
    );
  }

  const res: any = await execApi({
    url: `api/crm/company/update/operation`,
    method: "PUT",
    isCrmApi: true,
    data,
  });

  if (res.status !== 200) {
    throw new Error("Erro ao editar empresa");
  }

  return res.data;
};

interface EnterpriseResponse {
  items: Enterprise[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export function useEmpresas(pageIndex: number, pageSize: number, search: { tpFilter: string, filterValue: string }) {
  const idOperation = useOperationStore((state) => state.idOperation);
  return useQuery<EnterpriseResponse>({
    queryKey: [
      "fetchCompaniesDataPagination",
      pageIndex,
      pageSize,
      idOperation,
      search
    ],
    queryFn: () => fetchCompanies(pageIndex, pageSize, idOperation, search),
    placeholderData: keepPreviousData,
    staleTime: 0,
    retry: 0,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    enabled: !!idOperation,
  });
}

async function fetchCompanies(
  pageIndex: number,
  pageSize: number,
  idOperation: string | null,
  search: { tpFilter: string, filterValue: string }
): Promise<EnterpriseResponse> {
  if (!idOperation) {
    toast.error("Selecione uma operação para buscar empresas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
  try {
    let url = `api/crm/company/find/operation/${idOperation}/hierarchy?pageNumber=${pageIndex}&pageSize=${pageSize}`
    if(search.tpFilter && search.filterValue){
      url += `&tpFilter=${search.tpFilter}&filterValue=${encodeURIComponent(search.filterValue)}`
    }
    const res: any = await execApi({
      url,
      method: "GET",
      isCrmApi: true,
      data: {},
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error("Não foi possível buscar empresas ou não há empresas cadastradas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
}
