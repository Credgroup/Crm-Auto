import { execApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ShowHideInformation from "../../../ShowHideInformation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type AdicionalProdutoTabProps = {
    idSeguro?: number | string | null;
}


export default function AdicionalProdutoTab({ idSeguro }: Readonly<AdicionalProdutoTabProps>) {

    const [arrayOfAdicional, setArrayOfAdicional] = useState<any[]>([]);
    const [canViewInfo, setCanViewInfo] = useState(false);

    const { data, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["adicionalProduto", idSeguro],
        queryFn: () => getAdicionalProduto({ idSeguro }),
        enabled: !!idSeguro,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 0,
    })


    useEffect(() =>{
        if (isSuccess && data) {
            const arrayOfAdicional: any[] = Object.entries(data).map(([key, value]: [string, any]) => {
                return {
                    kayName: key,
                    keyValue: value,
                }
            });

            setArrayOfAdicional(arrayOfAdicional);
        }
    }, [isSuccess, data])

    useEffect(()=>{
        if(isError && error) {
            console.log(error);
        }
    }, [isError, error])

    return (
        <>
            <div className="flex items-center space-x-2 mb-8">
                <p className="font-medium text-xl">Detalhes do produto</p>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8"
                    onClick={() => setCanViewInfo((prev) => !prev)}
                    >
                    {canViewInfo && <EyeOff />}
                    {!canViewInfo && <Eye />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Visualizar</TooltipContent>
                </Tooltip>
            </div>

            <div className="bg-muted/70 rounded-md p-4 w-full ">

                    {
                        isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        )
                    }
                    {
                        !isLoading && !isError && arrayOfAdicional.length > 0 && (
                            <div className="grid grid-cols-2 w-full gap-4">
                                {arrayOfAdicional.map((item) => (
                                    <div key={item.kayName}>
                                        <p className="text-sm text-gray-500">{item.kayName}:</p>
                                        <ShowHideInformation show={canViewInfo}>
                                            <p className="font-medium break-words">{item.keyValue ? item.keyValue : "--"}</p>
                                        </ShowHideInformation>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {
                        !isLoading && !isError && arrayOfAdicional.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-gray-500">Nenhum adicional encontrado</p>
                            </div>
                        )
                    }

                    {
                        !isLoading && isError && error && (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-sm text-red-500 w-full">{error.message}</p>
                            </div>
                        )
                    }
                
            </div>

        </>
    );
}

type GetAdicionalProdutoProps = {
    idSeguro?: number | string | null;
}

async function getAdicionalProduto({ idSeguro }: Readonly<GetAdicionalProdutoProps>) {
    if (!idSeguro) {
        throw new Error("IdSeguro não foi informado");
    };

    const res: any = await execApi({
        url: `api/crm/insurance/find/additional/data/${idSeguro}`,
        method: "GET",
        data: {},
        isCrmApi: true,
    })

    console.log(res);

    if(res.status && res.status !== 200) {
        throw new Error("Aconteceu algum erro ao buscar adicional do produto");
    }

    return res.data;
}