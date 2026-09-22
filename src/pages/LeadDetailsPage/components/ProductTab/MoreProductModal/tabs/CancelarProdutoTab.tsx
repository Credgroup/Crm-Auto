import { Button } from "@/components/ui/button";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { execApi } from "@/hooks/useApi";
import useDominios from "@/hooks/useDominios";
import { dev_log } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CancelarProdutoTabProps = {
  idSeguro?: string | number | null;
  cancelado?: boolean;
};

export default function CancelarProdutoTab({ idSeguro, cancelado }: Readonly<CancelarProdutoTabProps>) {
    const [cancelarProduto, setCancelarProduto] = useState(false);
    const [tpMotivoCancelamento, setTpMotivoCancelamento] = useState<string | undefined>(undefined);
    const [dsMotivoCancelamento, setDsMotivoCancelamento] = useState<string>("");
    const { data: tpCancelamento, isLoading, isError } = useDominios({ nmDominio: ["tpCancelamento"] });

    const { mutate: cancelarProdutoMutation, isPending } = useMutation({
        mutationFn: async ({ tpMotivoCancelamento, dsMotivoCancelamento }: { tpMotivoCancelamento: string, dsMotivoCancelamento: string }) => {
            dev_log(()=>{console.log({
                idSeguro,
                tpCancelamento: tpMotivoCancelamento,
                observacao: dsMotivoCancelamento
            })})
            const res: any = await execApi({
                url: `api/crm/insurance/cancel`,
                method: "POST",
                data: {
                    idSeguro,
                    tpCancelamento: Number(tpMotivoCancelamento),
                    observacao: dsMotivoCancelamento
                },
                isCrmApi: true
            })

            dev_log(()=>{console.log(res)})

            if(res.status !== 200 || !res.data.sucesso) {
                const msg = res.data.mensagem ?? "Erro ao cancelar produto";
                throw new Error(msg);
            }

            return res.data;
        },
        onSuccess: (data) => {
            dev_log(()=>{console.log(data)})
            toast.success("Produto cancelado com sucesso");
            setCancelarProduto(false);
            setTpMotivoCancelamento(undefined);
            setDsMotivoCancelamento("");
        },
        onError: (err) => {
            dev_log(()=>{console.log(err.message)})
            toast.error(err.message);
        }
    });

    const handleCancelarProduto = () => {
        if(!idSeguro) return;
        if(!tpMotivoCancelamento) {
            toast.error("Selecione o motivo do cancelamento");
            return;
        };
        if(!dsMotivoCancelamento) {
            toast.error("Descreva alguma observação");
            return;
        };
        cancelarProdutoMutation({
            tpMotivoCancelamento,
            dsMotivoCancelamento
        });
    }

    const handleReset = () =>{
        setCancelarProduto(false);
        setTpMotivoCancelamento(undefined);
        setDsMotivoCancelamento("");
    }

  return (
    <>
    {
        !cancelado ? (
            <>
                <div className="flex items-center space-x-2 mb-8">
                    <p className="font-medium text-xl">Cancelar Produto</p>
                </div>
                <div className="flex flex-col gap-4 dark:bg-red-700/10 bg-red-500/10 p-4 rounded-md border border-red-500/80">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-medium text-lg">Atenção, você está prestes a cancelar o produto.</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200">
                                Se cancelar o produto, a ação não poderá ser desfeita. Deseja continuar?
                            </p>
                            <Button variant="link" className="w-fit px-0" onClick={() => setCancelarProduto(true)}>Continuar</Button>
                        </div>
                    </div>
                    {
                        cancelarProduto && (
                            <div className="flex flex-col gap-2">
                                <hr className="border-zinc-200 dark:border-zinc-800 mb-2" />
                                <h2 className="font-medium text-lg">Motivo do cancelamento</h2>
                                <p className="text-sm mb-2">
                                    Selecione o motivo do cancelamento do produto.
                                </p>
                                <div className="flex gap-2 flex-col max-w-md">
                                    <Select value={tpMotivoCancelamento} onValueChange={(value) => setTpMotivoCancelamento(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o motivo do cancelamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                !isLoading && tpCancelamento && tpCancelamento[0].map((item) => (
                                                    <SelectItem key={item.iddominio} value={item.idchave}>{item.dschave}</SelectItem>
                                                ))
                                            }
                                            {
                                                isLoading && (
                                                    <SelectItem value="loading">Carregando...</SelectItem>
                                                )
                                            }
                                            {
                                                isError && (
                                                    <SelectItem value="error">Erro ao carregar os motivos de cancelamento</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                    <Textarea
                                        placeholder="Descreva alguma observação"
                                        className="w-full resize-none min-h-24"
                                        value={dsMotivoCancelamento}
                                        onChange={(e) => setDsMotivoCancelamento(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <Button variant="secondary" className="w-fit" onClick={handleReset}>Fechar</Button>
                                    <Button variant="destructive" className="w-fit" onClick={handleCancelarProduto} disabled={isPending}>
                                        {
                                            isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Efetuar cancelamento"
                                            )
                                        }
                                    </Button>
                                </div>
                            </div>
                        )
                    }

                </div>
            </>
        ) : (
            <div className="flex flex-col gap-2">
                <div className="flex items-center mb-2">
                    <p className="font-medium text-xl">O Produto já foi cancelado</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-800 dark:text-zinc-200">
                        O produto já foi cancelado, não é possível cancelar novamente.
                    </p>
                </div>
            </div>
        )
    }
        
    </>
  );
}