import { useEffect, useState } from "react";
import { execApi } from "@/hooks/useApi";
import { LuLoaderCircle, LuShieldCheck, LuCar, LuSmartphone } from "react-icons/lu";
import { CheckCircle } from "lucide-react";

type ProductPresentationSessionProps = {
  idProduct?: string | null;
};

export default function ProductPresentationSession({ idProduct }: ProductPresentationSessionProps) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!idProduct) return;
      try {
        setLoading(true);
        const res: any = await execApi({
          url: `api/crm/product/find/${idProduct}`,
      method: "GET",
      isCrmApi: true,
      data: {},
        });

        if (res.data) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [idProduct]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LuLoaderCircle className="animate-spin text-4xl text-[var(--cor-principal)]" />
        <p className="text-muted-foreground">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  const getIcon = () => {
    switch (product.tpCategoria) {
      case 1: return <LuShieldCheck className="w-12 h-12 text-blue-500" />;
      case 4: return <LuCar className="w-12 h-12 text-green-500" />;
      case 5: return <LuCar className="w-12 h-12 text-purple-500" />;
      case 6: return <LuSmartphone className="w-12 h-12 text-orange-500" />;
      default: return <LuShieldCheck className="w-12 h-12 text-[var(--cor-principal)]" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-muted/50 rounded-full">
            {getIcon()}
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">{product.nmProduto}</h2>
        <p className="text-lg text-muted-foreground">{product.dsProduto}</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Vantagens e Benefícios</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Processo 100% digital e sem burocracia.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Aprovação rápida e condições flexíveis.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Suporte humanizado em todas as etapas da sua jornada.</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-[var(--cor-principal)]/10 text-[var(--cor-principal)] p-4 rounded-lg text-center">
        <p className="font-medium">Para iniciar, clique em "Avançar" ou selecione a próxima etapa ao lado.</p>
      </div>
    </div>
  );
}
