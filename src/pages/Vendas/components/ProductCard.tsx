import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import ProductDialog from "./ProductDialog";
import { Product } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { LuPackage2 } from "react-icons/lu";
import { useSidebar } from "@/components/ui/sidebar";


type ProductCardProps = {
  produto: Partial<Product>;
};

export const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {

  const navigate = useNavigate()
  const { setOpen: setSidebarOpen } = useSidebar();

  // const blobsPath = import.meta.env.VITE_THEME_BLOBS_PATH

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl">
      {/* Header */}
      
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <StatusBadge cdStatus={produto.cdStatus} />
        </div>
        {
          produto.tpProduto === 51 ? (
            <Button className="w-8 h-8 rounded-full" variant="secondary" onClick={()=>{
              navigate(`/sales/product/${produto.idProduto}`)
              setSidebarOpen(false)
            }}>
                <ArrowUpRight className="w-5 h-5"/>
            </Button>
          ) : (
            <ProductDialog produto={produto} planos={produto.produtosAgrupado}/>
          )
        }
      </div>
      {/* Imagem */}
      <div className="relative w-full overflow-hidden bg-zinc-950">
        {produto.dsLogo ? (
          <img
            src={produto.dsLogo}
            alt={produto.nmProduto}
            className="h-48 w-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center">
            <LuPackage2 className="text-4xl text-zinc-500 dark:text-zinc-200" />
          </div>
        )}
      </div>
      {/* Footer */}
      <CardContent className="flex flex-col items-start justify-start w-full p-4 flex-1">
        <span className="text-[11px] uppercase tracking-widest text-[var(--cor-principal)] font-bold mb-1 block">
          Solução F&amp;I · {produto.cdProduto}
        </span>
        <h3 
          className="font-bold text-base md:text-lg text-left leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-1 w-full mb-1.5" 
          title={produto.nmProduto}
        >
          {produto.nmProduto}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 text-left leading-relaxed w-full">
          {produto.dsProduto}
        </p>
      </CardContent>
    </Card>
  );
};
