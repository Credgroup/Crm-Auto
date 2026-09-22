import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LuCopy, LuCircleAlert } from "react-icons/lu";
import { execApi } from "@/hooks/useApi";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardDescription } from "@/components/ui/card";
import { CircleDollarSign, Loader2 } from "lucide-react";

type ShortlinksProdutoTabProps = {
  idSeguro: number | undefined;
  chStatusSeguro: number | undefined
};

export function ShortlinksProdutoTab({ idSeguro, chStatusSeguro }: Readonly<ShortlinksProdutoTabProps>) {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLink = async () => {
    try {
      setIsLoading(true);

      const res: any = await execApi({
        url: "api/crm/payment/public/generate/shortlink",
        method: "POST",
        data: {
          idSeguro,
        },
        isCrmApi: true,
      });

      if (res?.data?.codigo !== 0) {
        throw new Error("Erro ao gerar shortlink");
      }

      setLink(res.data.urlshort);
      toast.success("Link de pagamento gerado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar link de pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 max-w rounded-md">
            <div className="flex items-center space-x-2 mb-8">
                <p className="font-medium text-xl">Shortlink de pagamento</p>
            </div>

            <div className="flex flex-col gap-y-4 max-w bg-muted/70 rounded-md p-4 items-center w-full">
            {chStatusSeguro !== 5 && (
                <div className="flex gap-x-2">
                    <Card>
                        <CardDescription className="flex flex-row items-center gap-x-2 text-md">
                            <LuCircleAlert />
                            Só é possível gerar outro shortlink se o produto estiver em Pré-Venda
                        </CardDescription>
                    </Card>
                </div>
            )}
        <Button onClick={handleGenerateLink} disabled={isLoading || chStatusSeguro !== 5}
            className="w-1/2"
        >
            {!isLoading && (
                <div className="flex flex-row items-center justify-center gap-x-2">
                    <CircleDollarSign /> Gerar link de pagamento
                </div>
            )}

            {isLoading && (
                <div className="flex flex-row items-center gap-x-2">
                    <Loader2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300 animate-spin" />
                    Gerando link...
                </div>
            )}
        </Button>

        {link && (
            <div className="flex gap-x-2 w-1/2">
            <Input value={link} readOnly />
            <Tooltip>
                <TooltipTrigger asChild>
                <Button
                    size="icon"
                    className="aspect-square"
                    onClick={() => copyToClipboard(link)}
                >
                    <LuCopy />
                </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar link</TooltipContent>
            </Tooltip>
            </div>
        )}
        </div>
    </div>
  );
}
