import { useMutation } from "@tanstack/react-query";
import { decrypt, encrypt } from "./useCrypt";
import { execApi } from "./useApi";
import { toast } from "./use-toast";

export function useSendCode(onSuccess?: () => void) {
  const {
    mutate: sendCode,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["sendCode"],
    mutationFn: async (userCode: string) => {
      const userEncrypt = localStorage.getItem("user");
      console.log(userEncrypt);

      if (!userEncrypt) {
        throw new Error("Faça login novamente!");
      }

      const user = JSON.parse(decrypt(userEncrypt));
      console.log(user);

      let sendCodeParams = {};
      let googleConfigs = null;
      const googleMfaConfigsExist = localStorage.getItem("googleMfaConfigs");
      if (googleMfaConfigsExist) {
        googleConfigs = JSON.parse(decrypt(googleMfaConfigsExist));
        googleConfigs = googleConfigs.key;
      }
      if (googleConfigs) {
        sendCodeParams = {
          AccessId: encrypt(user.IdAccess),
          Code: userCode,
          key: googleConfigs,
        };
      } else {
        sendCodeParams = {
          AccessId: encrypt(user.IdAccess),
          Code: userCode,
        };
      }
      console.log(sendCodeParams);

      try {
        const response = await execApi({
          url: "api/security/validate/mfa",
          method: "POST",
          isAuthApi: true,
          data: sendCodeParams,
        });
        return response;
      } catch (error: any) {
        console.log(error);
        console.log(error.response.status);

        if (error.response.status == 401) {
          throw new Error("Código errado, tente novamente");
        }

        throw new Error("Erro ao enviar o código");
      }
    },
    onSuccess: (res: any) => {
      console.log(res);

      if ("sucesso" in res.data) {
        throw new Error(
          res.data.message ?? "Não foi possível validar esse código"
        );
      }

      toast({ title: "Código enviado com sucesso." });
      localStorage.setItem("token", res.data.accessToken);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Erro ao enviar código:", error);
      toast({ title: error.message });
    },
  });

  return {
    sendCode,
    isPending,
    isError,
  };
}

export function useReSendCode(onSuccess?: () => void) {
  const {
    mutate: reSendCode,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["reSendCode"],
    mutationFn: async () => {
      const userEncrypt = localStorage.getItem("user");
      console.log(userEncrypt);

      if (!userEncrypt) {
        throw new Error("Faça login novamente!");
      }

      const user = JSON.parse(decrypt(userEncrypt));
      console.log(user);

      const reSendCodeParams = {
        userID: user.Login,
      };
      console.log(reSendCodeParams);

      try {
        const response = await execApi({
          url: "api/security/reset/mfa/v1/code",
          method: "POST",
          data: reSendCodeParams,
        });
        return response;
      } catch (error: any) {
        console.log(error);
        console.log(error.response.status);

        if (error.response.status == 401) {
          throw new Error("Não foi possível reenviar o código!");
        }

        throw new Error("Erro ao reenviar o código");
      }
    },
    onSuccess: (res: any) => {
      console.log(res);

      if ("sucesso" in res.data) {
        throw new Error(
          res.data.message ?? "Não foi possível reenviar esse código"
        );
      }

      onSuccess?.();
    },
    onError: (error) => {
      console.error("Erro ao reenviar o código:", error);
      toast({ title: error.message });
    },
  });

  return {
    reSendCode,
    isPending,
    isError,
  };
}
