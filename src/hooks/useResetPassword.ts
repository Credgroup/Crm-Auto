import { useMutation } from "@tanstack/react-query";
import { execApi } from "./useApi";
import { toast } from "./use-toast";
import { decrypt, encrypt } from "./useCrypt";
import { z } from "zod";

type formType = {
  recover_email: string;
};

export function useResetPassword(onSuccess?: () => void) {
  const {
    mutate: resetPassword,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (recoverEmailObj: formType) => {
      const idParceiro = Number(import.meta.env.VITE_IDPARCEIRO);
      const resetPasswordParams = {
        userID: recoverEmailObj.recover_email,
        idParceiro: idParceiro,
      };
      console.log(resetPasswordParams);

      try {
        const response = await execApi({
          url: "api/security/forgot/password",
          method: "POST",
          data: resetPasswordParams,
        });
        return response;
      } catch (error: any) {
        console.log(error);
        const a = error.message.toLowerCase().includes("network error");
        console.log(a);
        if (a) {
          throw new Error(
            "Não foi possível recuperar a senha. Tente novamente mais tarde."
          );
        }
        throw new Error(error.message);
      }
    },
    onSuccess: (res: any) => {
      console.log(res);

      if (!res?.data.sucesso) {
        throw new Error(res.data.message ?? "Não foi possível resetar a senha");
      }

      onSuccess?.();
    },
    onError: (error) => {
      console.log("Erro ao resetar sua senha:", error);
      toast({ title: error.message });
    },
  });

  return {
    resetPassword,
    isPending,
    isError,
  };
}

type createNewPasswordProps = {
  new_pass: string;
};

export function useCreateNewPassword(senhaAntiga: string = "", onSuccess?: () => void) {
  const {
    mutate: createNewPassword,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["newPassword"],
    mutationFn: async (newPasswordObj: createNewPasswordProps) => {
      const userEncrypt = localStorage.getItem("user");
      let user = null;
      if (!userEncrypt) {
        throw new Error("Faça login para definir uma nova senha");
      }
      user = JSON.parse(decrypt(userEncrypt));
      console.log(user);

      const newPasswordParams = {
        senhaAntiga: encrypt(senhaAntiga),
        senha: encrypt(newPasswordObj.new_pass),
        tpsenha: 376,
      };
      console.log(newPasswordParams);

      try {
        const response = await execApi({
          url: "api/keepins/v1/usuario/editar",
          data: newPasswordParams,
          method: "PUT",
        });
        return response;
      } catch (error: any) {
        console.log(error);
        console.log(error.response.status);
        throw new Error(error.message);
      }
    },
    onSuccess: (res: any) => {
      console.log(res);

      if ("sucesso" in res.data && !res.data.sucesso) {
        throw new Error(
          res.data.descricao ?? "Não foi possível criar nova senha"
        );
      }

      onSuccess?.();
    },
    onError: (error) => {
      console.log("Erro ao criar sua nova senha:", error);
      toast({ title: error.message });
    },
  });

  return {
    createNewPassword,
    isPending,
    isError,
  };
}

export const newSenhaSchema = z.object({
  new_pass: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .refine((val) => /[a-z]/.test(val), {
      message: "A senha deve conter pelo menos uma letra minúscula",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "A senha deve conter pelo menos um caractere especial",
    }),
});

export type NewSenhaType = z.infer<typeof newSenhaSchema>;
