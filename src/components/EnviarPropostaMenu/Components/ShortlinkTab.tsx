import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { execApi } from "@/hooks/useApi";
import { copyToClipboard } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { Label } from "@radix-ui/react-label";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuCopy, LuLoaderCircle } from "react-icons/lu";

export default function ShortlinkTab({
  proposalId,
}: Readonly<{ proposalId?: string }>) {
  const idOperation = useOperationStore((state) => state.idOperation);
  const [shortlink, setShortlink] = useState("");
  const { data, isLoading, isError, isSuccess, error, isRefetching } = useQuery(
    {
      queryKey: ["createProposalShortlink", proposalId],
      queryFn: async () => {
        const res: any = await execApi({
          url: "api/crm/proposal/generate/shortlink",
          method: "POST",
          data: {
            idGrupoProposta: proposalId,
          },
          isCrmApi: true,
        });
        if (!res) {
          throw new Error("Erro ao buscar shortlink");
        }
        return res.data;
      },
      enabled: !!idOperation,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
      retry: false,
    }
  );

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data.urlshort);
      setShortlink(data.urlshort);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col justify-center items-center gap-y-4 h-[400px] text-center">
      {(isLoading || isRefetching) && (
        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-semibold text-xl mb-2">Gerando Shortlink</h1>
          </div>
          <Label className="flex gap-2 justify-between items-center">
            <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            <Button className="w-10 h-10 aspect-square" disabled>
              <LuLoaderCircle className="animate-spin" />
            </Button>
          </Label>
        </div>
      )}
      {isError && <p>Erro ao carregar shortlink: {error.message}</p>}
      {isSuccess && data && !isLoading && !isRefetching && (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-semibold text-xl mb-2">
              Link gerado com sucesso!
            </h1>
            <p>Copie o link abaixo para enviar para seu cliente</p>
          </div>
          <Label className="flex gap-2 justify-between items-center">
            <Input
              type="text"
              value={shortlink}
              readOnly
              className="w-full h-10"
            />
            <Button
              onClick={() => copyToClipboard(shortlink)}
              className="w-10 h-10 aspect-square"
            >
              <LuCopy />
            </Button>
          </Label>
        </div>
      )}
    </div>
  );
}
