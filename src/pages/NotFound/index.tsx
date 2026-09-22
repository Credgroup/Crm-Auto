import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackToSales = () => {
    navigate("/sales");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-red-600">404</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Página não encontrada
          </CardTitle>
          <CardDescription className="dark:text-zinc-400">
            A página que você está procurando não existe ou foi movida. <br />Verifique se o endereço está correto ou navegue para outra página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGoBack}
              className="w-full"
            >
              Voltar à Página Anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToSales}
              className="w-full"
            >
              Ir para Vendas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 