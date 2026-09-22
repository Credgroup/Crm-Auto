import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { Person } from "@/types";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import BindLeadEnterpriseDialog from "./BindLeadEnterpriseDialog";
import BindedPersonContacts from "./BindedPersonContacts";

type ContatoEnterpriseTabProps = {
  id?: string | null;
};

type FetchEnterprisePersonsByIdType = {
  items: Partial<Person>[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};

export default function ContatoEnterpriseTab({
  id,
}: Readonly<ContatoEnterpriseTabProps>) {
  const { data, isSuccess, isError, error, isLoading, refetch, isRefetching } =
    useQuery({
      queryKey: ["fetchEnterprisePersonsById", id],
      queryFn: async () => {
        const res: AxiosResponse<FetchEnterprisePersonsByIdType> =
          await execApi({
            url: "api/crm/lead/find/representative",
            method: "POST",
            data: {
              idEmpresaOperacao: id,
            },
            isCrmApi: true,
          });

        if (res.status !== 200 || !res.data) {
          throw new Error("Erro ao buscar representantes da empresa");
        }
        return res.data;
      },
      refetchInterval: 0,
      refetchOnWindowFocus: false,
      retry: false,
    });
  const [bindedPersons, setBindedPersons] = useState<Partial<Person>[]>([]);

  useEffect(() => {
    if (isSuccess && data) {
      setBindedPersons(data.items ?? []);
    }
  }, [isSuccess, isRefetching]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
    }
  }, [isError]);

  if (!id) {
    return <div>Id não encontrado</div>;
  }

  return (
    <>
      <div className="relative">
        <BindLeadEnterpriseDialog
          idEmpresaOperacao={id}
          closeAction={() => refetch()}
        />
      </div>
      <div className="relative flex flex-col w-full space-y-4 mt-10">
        {isLoading && (
          <div className="w-full h-32 bg-muted animate-pulse rounded-md"></div>
        )}

        {!isLoading && bindedPersons.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <h1 className="text-lg font-semibold">Nenhum contato encontrado</h1>
            <p className="text-sm text-gray-500">
              Não há contatos vinculados a esta empresa.
            </p>
          </div>
        )}

        {!isLoading &&
          bindedPersons.length > 0 &&
          bindedPersons.map((item) => (
            <BindedPersonContacts
              person={item}
              key={item.idSeguradoI2k}
              qtdPersonsContacts={2}
            />
          ))}
      </div>
    </>
  );
}
