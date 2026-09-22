import { useEffect, useState } from "react";
import { format } from "date-fns";
import Cockpit from "./components/Cockpit";
import Filters from "./components/Filters";
import RecentSales from "./components/RecentSales";
import AnalyticsSellerSales from "./components/AnalyticsSellerSales";
import AnalyticsProductSales from "./components/AnalyticsProductSales";
import { usePartnerStore } from "@/store/partnerStore";
import { useQueryClient } from "@tanstack/react-query";

export type Filters = {
  dataInicio?: string;
  dataFim?: string;
  idsOperacoes?: string[];
}

export default function Sales() {

    const partnerId = usePartnerStore((state) => state.partnerId);
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<Filters>({
      dataInicio: format(new Date(), "yyyy-MM-dd"),
      dataFim: format(new Date(), "yyyy-MM-dd"),
      idsOperacoes: ["1"]
    })

    useEffect(() =>{
      if(partnerId){
        // Reseta os filtros
        setFilters({dataInicio: format(new Date(), "yyyy-MM-dd"), dataFim: format(new Date(), "yyyy-MM-dd"), idsOperacoes: ["1"]})

        // Invalida o cache do React Query para forçar refetch automático
        queryClient.invalidateQueries({ queryKey: ["AnalyticsProductSales"] });
        queryClient.invalidateQueries({ queryKey: ["AnalyticsSellerSales"] });
        queryClient.invalidateQueries({ queryKey: ["SalesCockpit"] });
        queryClient.invalidateQueries({ queryKey: ["operations"] });
      }
    }, [partnerId, queryClient])
  
    return (
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vendas</h1>
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        {/* Cards */}
        <Cockpit filters={filters} className="mb-4" />
        
        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <AnalyticsSellerSales filters={filters} />
          <AnalyticsProductSales filters={filters} />
        </div>

        {/* Recent Sales */}
        <RecentSales filters={filters} />
      </div>
    ); 
}
