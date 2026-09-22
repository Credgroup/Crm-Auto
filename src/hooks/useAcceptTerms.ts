import { useMutation } from "@tanstack/react-query";
import { decrypt } from "./useCrypt";
import { execApi } from "./useApi";
import { toast } from "./use-toast";

export function useAcceptTerms(onSuccess?: () => void) {
  const {
    mutate: acceptTerms,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["acceptTerms"],
    mutationFn: async () => {
      const userEncrypt = localStorage.getItem("user");
      console.log(userEncrypt);

      if (!userEncrypt) {
        throw new Error("Faça login novamente!");
      }

      const user = JSON.parse(decrypt(userEncrypt));
      console.log(user);

      const acceptTermsParams = {
        idUsuarioedit: user.IdAccess,
        tptermosistema: "386",
        idUsuario: user.IdAccess,
        appHost: window.location.hostname,
        appIP: "0.0.0.0",
      };

      console.log(acceptTermsParams);

      try {
        const response = await execApi({
          url: "api/keepins/v1/usuario/editar",
          method: "PUT",
          data: acceptTermsParams,
        });
        return response;
      } catch (error: any) {
        console.log(error);
        console.log(error.response.status);

        if (error.response.status == 401) {
          throw new Error("Não foi possível aceitar os termos, tente novamente");
        }

        throw new Error("Erro ao aceitar os termos");
      }
    },
    onSuccess: (res: any) => {
      console.log(res);

      if ("sucesso" in res.data && !res.data.sucesso) {
        throw new Error(
          res.data.mensagem ?? "Não foi possível aceitar os termos"
        );
      }

      onSuccess?.();
    },
    onError: (error) => {
      console.error("Erro ao aceitar os termos:", error);
      toast({ title: error.message });
    },
  });

  return {
    acceptTerms,
    isPending,
    isError,
  };
}
