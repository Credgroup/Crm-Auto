import { Badge } from "../ui/badge";
import useDominios from "@/hooks/useDominios";
import { Dominio } from "@/types";
import { useEffect, useState } from "react";

type StatusBadgeProps = {
  cdStatus?: number;
  idDominio?: number;
  nmDominio?: string;
  dominiosList?: Dominio[];
};

function defaultStatus(cdStatus?: number){
    // ativo
    if (cdStatus === 1 || cdStatus === 6) {
      return (
        <Badge className="bg-green-500 hover:bg-green-700 text-white rounded-full">
          Ativo
        </Badge>
      );
    }
  
    // desativado
    if (cdStatus === 2 || cdStatus === 7) {
      return (
        <Badge className="bg-red-500 hover:bg-red-700 text-white rounded-full">
          Desativado
        </Badge>
      );
    }
  
    // suspenso
    if (cdStatus === 3 || cdStatus === 8) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-700 text-white rounded-full">
          Suspenso
        </Badge>
      );
    }
  
    // cancelado
    if (cdStatus === 4 || cdStatus === 9) {
      return (
        <Badge className="bg-gray-500 hover:bg-gray-700 text-white rounded-full">
          Cancelado
        </Badge>
      );
    }

    return <Badge className="rounded-full">Desconhecido: {cdStatus}</Badge>;
}

export default function StatusBadge({ cdStatus, nmDominio, dominiosList }: Readonly<StatusBadgeProps>) {

  const { data, isLoading, isError, isSuccess, error } = useDominios({nmDominio: nmDominio ? [nmDominio] : []})
  const [statusSelected, setStatusSelected] = useState<Dominio | null>(null)

  useEffect(()=>{
    if(isSuccess && data){
      const [dominioSearched] = data
      console.log(dominioSearched)
      console.log(cdStatus)
      const status = dominioSearched.find((item: Dominio) => parseInt(item.idchave) === cdStatus);
      console.log(status);
      if(status){
        setStatusSelected(status)
      }
    }
  }, [isSuccess, data])

  useEffect(()=>{
    if(isError){
      console.log(error);
    }
  }, [isError, error])

  if(dominiosList && cdStatus){
    const status = dominiosList.find((item: Dominio) => parseInt(item.idchave) === cdStatus);
    if(status){
      return (
        <Badge className="rounded-full whitespace-nowrap">
          {status.dschave}
        </Badge>
      );
    }
    return defaultStatus(cdStatus)
  }

  if(statusSelected && !isLoading){
    return (
      <Badge className="rounded-full whitespace-nowrap">
        {statusSelected.dschave}
      </Badge>
    );
  }

  if((!isLoading && !statusSelected) || isError){
    return defaultStatus(cdStatus)
  }

  return <Badge className="rounded-full">Carregando..</Badge>
}
