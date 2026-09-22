import { useQuery } from "@tanstack/react-query";
import { execPrc } from "./useApi";
import { usePartnerStore } from "@/store/partnerStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import { Dominio } from "@/types";

type useSearchDominiosProps = {
  nmDominio: string[];
};

export default function useDominios({ nmDominio }: Readonly<useSearchDominiosProps>) {
  const user = useUsuarioStore((state) => state.usuario);
  const partnerId = usePartnerStore((state) => state.partnerId);
  return useQuery({
    queryKey: ["dominios", nmDominio],
    queryFn: async () => {
      if (!user?.idusuario || !partnerId) {
        throw new Error("Selecione um parceiro e uma operação");
      }
      const responses = await Promise.all(
        nmDominio.map((dominio) =>
          searchDominio(dominio, user.idusuario.toString(), partnerId)
        )
      );
      return responses;
    },
    refetchOnWindowFocus: false,
    enabled: nmDominio.length > 0,
  });
}

async function searchDominio(
  nmDominio: string,
  idUsuario: string,
  idParceiroOwner: string
) {
  const searchDominioParams = {
    nmDominio: nmDominio.toLowerCase(),
    appHost: "react",
    appIp: "0.0.0.0",
    idUsuario,
    idParceiroOwner,
  };
  const res = await execPrc({
    url: "api/service",
    prc: "8",
    data: searchDominioParams,
    method: "POST",
  });
  return res.data as Dominio[];
}
