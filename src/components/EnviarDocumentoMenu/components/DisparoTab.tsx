import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  isLoading?: boolean;
  resposta?: any;
}

export default function DisparoTab({ isLoading, resposta }: Readonly<Props>) {

  return (
    <Card className="p-4 w-full">
      <CardHeader>
        <CardTitle>Disparo do Documento</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loading */}
        {isLoading && (
          <Alert>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <AlertTitle>Enviando…</AlertTitle>
            <AlertDescription>
              Estamos processando a solicitação.
            </AlertDescription>
          </Alert>
        )}

        {/* Sucesso */}
        {!isLoading && resposta && (
          <Alert className="border-green-600">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-600">
              {resposta?.mensagem || "Sucesso"}
            </AlertTitle>
            <AlertDescription>
              O documento foi enviado com sucesso.
            </AlertDescription>
          </Alert>
        )}

        {/* Erro */}
        {!isLoading && !resposta && (
          <Alert className="border-red-600">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-600">
              {resposta?.mensagem || "Erro ao enviar"}
            </AlertTitle>
            <AlertDescription>
              {resposta?.dsErro || "Falha inesperada."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
