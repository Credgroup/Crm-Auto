/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { Button } from "@/components/ui/button";

type FilterHeaderProps = {
  filtros: {
    busca: string;
    ordenacao: string;
    direcao: string;
    status: string[];
  };
  setFiltros: (f: any) => void;
};

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  filtros,
  setFiltros,
}) => {
  const [searchTerm, setSearchTerm] = useState(filtros.busca);

    return (
    <div className="flex justify-between items-center gap-4 mb-6 border-b border-muted pb-4 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full max-w-xs">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nome do produto..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="aspect-square" size="icon" onClick={() => setFiltros({ ...filtros, busca: searchTerm })}>
          <LuSearch />
        </Button>
      </div>
    </div>
  );
};
