import SmallAvatarSkeleton from "@/components/Skeletons/SmallAvatarSkeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { execApi } from "@/hooks/useApi";
import { encrypt } from "@/hooks/useCrypt";
import { obterIniciais } from "@/lib/obterIniciais";
import { dev_log, formatValue } from "@/lib/utils";
import { Enterprise } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router";

type LinkedEnterpriseAvatarProps = {
  id?: string;
};

function catchErrorNumber(error: any){
  dev_log(()=>console.log(error))
  dev_log(()=>console.log(error.message))
  if(error.message.includes("status code 404")){
    return 404
  }
  return 0
}

export default function LinkedEnterpriseAvatar({
  id,
}: Readonly<LinkedEnterpriseAvatarProps>) {
  const [LinkedError, setLinkedError] = useState<number | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchLinkedEnterprise", id],
    queryFn: async () => {
      const res = await execApi({
        url: `api/crm/company/find/${id}`,
        method: "GET",
        data: {},
        isCrmApi: true,
      });

      if (res.status !== 200) {
        throw new Error("Erro ao buscar empresa vinculada");
      }
      return res.data as Enterprise;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(()=>{
    if(isError && error){
      setLinkedError(catchErrorNumber(error))
    }
  }, [isError, error])

  if (!id) {
    return <p>Nenhuma empresa vinculada</p>;
  }

  return (
    <div className="w-full max-w-xs">
      {isLoading && <SmallAvatarSkeleton />}
      {isError && (
        <>
          {LinkedError === 404 && (
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-gray-500">Nenhuma empresa vinculada</p>
            </div>
          )}
          {LinkedError !== 404 && (
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-gray-500">Erro ao buscar empresa vinculada: {error.message}</p>
            </div>
          )}
        </>
      )}
      {data && !isLoading && (
        <div className="mb-4">
          <h1 className="text-sm mb-2 text-gray-500">Vinculado (a) com</h1>
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarFallback className="rounded-full">
                {obterIniciais(data?.nmFantasia ?? "??")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Link
                to={`/lead/details/${encodeURIComponent(
                  encrypt(
                    JSON.stringify({
                      id: data.idEmpresaOperacao,
                      type: "enterprise",
                    })
                  )
                )}`}
                className="truncate font-semibold hover:underline mb-0.5"
              >
                {data?.nmFantasia}
              </Link>
              <p className="truncate text-xs">
                {formatValue("cnpj", data.nrCNPJ)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
