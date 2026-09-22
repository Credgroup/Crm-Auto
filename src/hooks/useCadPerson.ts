import { toast } from "sonner";
import { execApi } from "./useApi";
import { Enterprise, Person } from "@/types";
import { format, parse } from "date-fns";
import { useOperationStore } from "@/store/operationStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const cadastrarPessoa = async (
  data: Partial<Person>,
  idOperacao: string | null
) => {
  if (!idOperacao) {
    toast.error("Selecione uma operação para cadastrar empresa");
    return;
  }
  const cadPersonParams: Partial<Person> & { cdStatus: string } = {
    nome: data.nome,
    dataNascimento: data.dataNascimento,
    cpf: data.cpf,
    estadoCivil: data.estadoCivil,
    sexo: data.sexo,
    idExterno: data.idExterno,
    contato: data.contato,
    email: data.email,
    adicional: data.adicional,
    idOperacao: parseInt(idOperacao),
    cdStatus: "6",
  };
  console.log(cadPersonParams);
  const res = await execApi<Enterprise>({
    url: "api/crm/lead/register",
    data: cadPersonParams,
    method: "POST",
    isCrmApi: true,
  });
  return res.data;
};

type CadastrarEVincularPessoaProps = {
  data: Partial<Person | null>;
  idOperacao: number | null;
  idEmpresaOperacao: string | null;
};

export const cadastrarEVincularPessoa = async ({
  data,
  idOperacao,
  idEmpresaOperacao,
}: CadastrarEVincularPessoaProps) => {
  if (!idOperacao || !idEmpresaOperacao || !data) {
    console.log(idOperacao, idEmpresaOperacao, data);
    throw new Error("Necessário enviar parametros para vincular a pessoa");
  }
  const cadPersonParams: any = {
    nome: data.nome,
    dataNascimento:
      data.dataNascimento &&
      format(
        parse(data.dataNascimento, "dd/MM/yyyy", new Date()),
        "yyyy-MM-dd"
      ),
    cpf:
      data.cpf &&
      parseInt(
        data.cpf.toString().replace(".", "").replace(".", "").replace("-", "")
      ),
    estadoCivil: data.estadoCivil,
    sexo: data.sexo,
    idExterno: data.idExterno,
    contato: data.contato,
    email: data.email,
    adicional: data.adicional,
    idOperacao,
    cdStatus: 6,
    idEmpresaOperacao,
  };
  console.log(cadPersonParams);
  const res = await execApi<any>({
    url: "api/crm/lead/register",
    data: cadPersonParams,
    method: "POST",
    isCrmApi: true,
  });
  return res.data;
};

export interface PersonResponse {
  items: Person[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

type usePessoasProps = {
  pageIndex: number;
  pageSize: number;
  search?: { tpFilter: string, filterValue: string };
  url?: string;
};

export function usePessoas({
  pageIndex,
  pageSize,
  search,
  url,
}: Readonly<usePessoasProps>) {
  const idOperation = useOperationStore((state) => state.idOperation);
  return useQuery<PersonResponse>({
    queryKey: [
      "fetchPersonDataPagination",
      idOperation,
      pageIndex,
      pageSize,
      idOperation,
      search
    ],
    queryFn: () => fetchPerson(pageIndex, pageSize, idOperation, url, search),
    placeholderData: keepPreviousData,
    staleTime: 0,
    retry: 0,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
  });
}

async function fetchPerson(
  pageIndex: number,
  pageSize: number,
  idOperation: string | null,
  url?: string,
  search?: { tpFilter: string, filterValue: string }
): Promise<PersonResponse> {
  if (!idOperation) {
    toast.error("Selecione uma operação para buscar empresas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
  try {
    let urlPath = url ?? `api/crm/lead/find/operation/${idOperation}?pageNumber=${pageIndex}&pageSize=${pageSize}`

    if (search?.tpFilter && search?.filterValue) {
      urlPath += `&tpFilter=${search.tpFilter}&filterValue=${encodeURIComponent(search.filterValue)}`
    }

    const res: any = await execApi({
      url: urlPath,
      method: "GET",
      isCrmApi: true,
      data: {},
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar pessoas");
    return { items: [], totalCount: 0, pageNumber: 0, pageSize: 0 };
  }
}

export const editarPessoa = async (data: Partial<Person | null>) => {
  if (!data || !Object.keys(data).length || !data.idSeguradoI2k) {
    throw new Error(
      "IdSeguradoI2k não encontrado ou dados vazios para editar pessoa"
    );
  }

  const res: any = await execApi({
    url: `api/crm/lead/update`,
    method: "PUT",
    isCrmApi: true,
    data,
  });

  if (res.status !== 200) {
    throw new Error("Erro ao editar empresa");
  }

  return res.data;
};

export async function handleBindExistentPerson({
  idSeguradoI2k,
  idEmpresaOperacao,
}: {
  idSeguradoI2k: number | null;
  idEmpresaOperacao: string | null;
}) {
  if (!idSeguradoI2k || !idEmpresaOperacao) {
    toast.error("Necessário enviar parametros para vincular a pessoa");
    return;
  }

  const res = await execApi({
    url: "api/crm/lead/bind/companyOperation",
    data: {
      idSeguradoI2k,
      idEmpresaOperacao,
    },
    method: "PUT",
    isCrmApi: true,
  });

  if (!res) {
    throw new Error("Erro ao vincular a pessoa");
  }

  return res.data;
}
