import { useState } from "react";
import { FilterHeader } from "./components/FilterHeader";
import ProductCardList from "./components/ProductCardList/ProductCardList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t } from "@/lib/i18n";

const filtrosIniciais = {
  busca: "",
  ordenacao: "criação",
  direcao: "asc",
  status: [],
  categoria: "1", // 1 = Seguros, 4 = Financiamentos, 5 = Combo, 6 = Serviços
  subCategoria: "all"
};

export default function Vendas() {
  const [filtros, setFiltros] = useState(filtrosIniciais);

  const handleTabChange = (value: string) => {
    setFiltros(prev => ({ ...prev, categoria: value, subCategoria: "all" }));
  };

  const handleSubCategoriaChange = (sub: string) => {
    setFiltros(prev => ({ ...prev, subCategoria: sub }));
  };

  const renderSubCategorias = () => {
    let options = [{ value: "all", label: t("sales.sub.all") }];
    
    if (filtros.categoria === "1") {
      options.push(
        { value: "caminhao", label: t("sales.sub.truck") },
        { value: "rastreador", label: t("sales.sub.tracker") }
      );
    } else if (filtros.categoria === "4") {
      options.push({ value: "veiculo", label: t("sales.sub.heavy") });
    } else if (filtros.categoria === "6") {
      options.push(
        { value: "assistencia", label: t("sales.sub.towing") },
        { value: "tag", label: t("sales.sub.tag") },
        { value: "vistoria", label: t("sales.sub.inspection") }
      );
    } else {
      return null;
    }

    return (
      <div className="flex gap-2 mb-6 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSubCategoriaChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtros.subCategoria === opt.value
                ? "bg-[var(--cor-principal)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cor-principal)]">Mercedes-Benz Trucks · F&amp;I</p>
        <h1 className="mt-1 text-3xl font-bold">Soluções para cada jornada</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Crédito, proteção e serviços conectados para o cliente sair com o caminhão pronto para trabalhar.</p>
      </div>
      
      <Tabs value={filtros.categoria} onValueChange={handleTabChange} className="w-full mb-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="1">{t("sales.insurance")}</TabsTrigger>
          <TabsTrigger value="4">{t("sales.financing")}</TabsTrigger>
          <TabsTrigger value="5">{t("sales.combo")}</TabsTrigger>
          <TabsTrigger value="6">{t("sales.services")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {renderSubCategorias()}

      <FilterHeader filtros={filtros} setFiltros={setFiltros} />
      <ProductCardList filtros={filtros} />
    </div>
  );
}
