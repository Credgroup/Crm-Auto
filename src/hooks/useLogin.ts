import { setAutenticado } from "@/store/autenticadoStore";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { toast, useToast } from "./use-toast";
import { decrypt, encrypt } from "./useCrypt";
import axios from "axios";
import { z } from "zod";
import { UsuarioItem } from "@/types";
import { execApi, execPrc } from "./useApi";
import { getDeviceInfo } from "./useDeviceInfo";
import { NavigateFunction } from "react-router";
import { dev_log, log } from "@/lib/utils";
import { setPartnerId } from "@/store/partnerStore";
import { setUsuario } from "@/store/usuarioStore";
import { usePermissionRoleStore } from "@/store/permissionRoleStore";

export interface JwtPayloadReturn extends JwtPayload {
  IdAccess: string;
  Login: string;
  name: string;
  email: string;
  profile: string;
  partner: string;
  tokenversion: string;
  tppassword: string;
  tpplatform: string;
  cdstatus: string;
}

export type LoginPropsSchema = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  user_email: z
    .string()
    .email({ message: "O conteúdo digitado não é um email" }),
  user_pass: z.string().trim().min(1, { message: "A senha é obrigatória" }),
});

export function validateLoginByParameters({
  setAutenticado,
  setUsuario,
}: {
  setAutenticado: (value: boolean) => void;
  setUsuario: (user: any) => void;
}): boolean {
  const params = new URLSearchParams(window.location.search);
  const json = params.get("params");
  if (!json) return false;

  let criticalData: any = {};
  try {
    const objParams = JSON.parse(decrypt(json));
    console.log(objParams);
    if (objParams?.token) {
      console.log("Token recebido:", objParams.token);
      localStorage.setItem("token", objParams.token);
    }
    if (objParams?.idParceiroowner) {
      console.log("ID do parceiro recebido:", objParams.idParceiroowner);
      setPartnerId(objParams.idParceiroowner);
      criticalData.partner = objParams.idParceiroowner;
    }
    if (objParams?.blobs) {
      localStorage.setItem("blobs", encrypt(JSON.stringify(objParams.blobs)));
    }
    if (objParams?.usuario) {
      const urlUser = JSON.parse(decrypt(objParams.usuario));
      criticalData.user = urlUser.idusuario;
      console.log("ID do usuário recebido:", criticalData.user);
      localStorage.setItem("user", urlUser);
      setUsuario(urlUser);
    }

    localStorage.setItem("erZNWpCKyq", encrypt(JSON.stringify(criticalData)));

    window.history.replaceState({}, document.title, "/");
    setAutenticado(true);
    return true;
  } catch (error) {
    console.error("Erro ao validar login por parâmetros:", error);
    return false;
  }
}

export function useLogin(onSuccess?: () => void) {
  const { toast } = useToast();
  const { mutate: loginFn, isPending } = useMutation({
    mutationFn: async (data: LoginPropsSchema) => {
      const tpPlatform = import.meta.env.VITE_PLATFORM;
      const idParceiro = Number(import.meta.env.VITE_IDPARCEIRO);
      console.log("tpplatform: " + tpPlatform);
      const tokenApiParams = {
        Login: data.user_email,
        Password: encrypt(data.user_pass),
        Platform: tpPlatform,
        IdParceiro: idParceiro
      };

      console.log(tokenApiParams);

      const api = import.meta.env.VITE_URL_AUTH_DOTCORE;

      return await axios.post(`${api}api/security/token`, tokenApiParams, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (response: any) => {
      if (response.data.authenticated) {
        try {
          if (!response.data.accessToken) {
            throw new Error("Token não está definido.");
          }

          const token = response.data.accessToken;
          localStorage.setItem("token", token);

          const decodedToken = jwtDecode<JwtPayloadReturn>(token);
          console.log("Token descriptografado");
          console.log(decodedToken);

          const encriptUserObj = encrypt(JSON.stringify(decodedToken));
          localStorage.setItem("user", encriptUserObj);

          const partner = decodedToken.partner;
          setPartnerId(partner);

          const criticalData = {
            user: decodedToken.IdAccess,
            partner,
          };

          log(new Error(JSON.stringify(criticalData)));
          localStorage.setItem(
            "erZNWpCKyq",
            encrypt(JSON.stringify(criticalData))
          );

          const userMfa = response.data.mfa;
          const googleMfa = encrypt(
            JSON.stringify({
              qrCode: response.data.qrCode,
              key: response.data.key,
            })
          );
          localStorage.setItem("confirmedCode", userMfa);
          if (response.data.key) {
            localStorage.setItem("googleMfaConfigs", googleMfa);
            console.log("google confirmed code: ", googleMfa);
          }
          console.log("confirmed code: ", userMfa);

          const expiration = getExpirationTime(response.data?.expiration);
          localStorage.setItem("expiration", expiration);
          console.log("Tempo de expiracao: ", expiration);

          localStorage.setItem("semilogado", "true");

          onSuccess?.();
        } catch (error) {
          console.log("Erro ao tentar fazer login:", error);
          toast({ title: "Falha na autenticação." });
        }
      }
    },
    onError: (error: any) => {
      console.log("Erro ao verificar o token:", error);
      toast({
        title: "Erro ao efetuar login",
        description:
          "Verifique se digitou algum campo errado ou se tem permissão para acessar a plataforma.",
      });
    },
  });

  return {
    loginFn,
    isPending,
  };
}

type criticalDataType = { user: string; partner: string };
function getCriticalData(): criticalDataType | null {
  const encryptData = localStorage.getItem("erZNWpCKyq");
  if (encryptData) {
    return JSON.parse(decrypt(encryptData));
  }
  return null;
}

function getExpirationTime(dateString: string) {
  const time = dateString.slice(11, 19);
  return time;
}

export function userConfirmCode() {
  const mfa = localStorage.getItem("confirmedCode") == "true";
  localStorage.removeItem("confirmedCode");
  return mfa;
}

export function userHasTemporaryPassword() {
  const userEncrypt = localStorage.getItem("user");
  if (userEncrypt) {
    const user = JSON.parse(decrypt(userEncrypt));
    return user.tppassword == "375";
  }
  return false;
}

export function userAcceptedTerms() {
  const userEncrypt = localStorage.getItem("user");
  if (userEncrypt) {
    const user = JSON.parse(decrypt(userEncrypt));
    console.log(user);
    return user.termSystem != "387";
  }
  return false;
}

type loadUserStateProps = {
  navigate: NavigateFunction;
  setAutenticado: (item: boolean) => void;
  setUsuario: (item: UsuarioItem) => void;
  stayInLastPage?: boolean;
};

export async function loadUserState({
  navigate,
  setAutenticado,
  setUsuario,
  stayInLastPage,
}: loadUserStateProps) {
  const criticalData = getCriticalData();
  const token = localStorage.getItem("token");

  if (!criticalData || !token) {
    console.log(criticalData);
    console.error("dados críticos nao definidos");
    toast({
      title: "Login expirado",
      description: "Faça login novamente para utilizar a ferramenta",
    });
    localStorage.clear();
    navigate("/login");
    return;
  }

  const userDataParams = {
    idparceiroowner: criticalData.partner,
    idusuarioselect: criticalData.user,
  };

  console.log(userDataParams);
  console.log(criticalData);

  const response = await execPrc({
    url: "api/service",
    prc: "1",
    data: userDataParams,
    method: "POST",
  });
  const userDataFromApi: any = response.data;
  dev_log(()=>console.log(userDataFromApi));
  const userData: UsuarioItem = {
    idusuario: userDataFromApi.idusuario,
    tpperfil: userDataFromApi.tpperfil,
    chtpperfil: userDataFromApi.chtpperfil,
    dstpperfil: userDataFromApi.dstpperfil,
    tpsenha: userDataFromApi.tpsenha,
    chsenha: userDataFromApi.chsenha,
    dssenha: userDataFromApi.dssenha,
    login: userDataFromApi.login,
    nmusuario: userDataFromApi.nmusuario,
    emailusuario: userDataFromApi.emailusuario,
    cryptsenha: userDataFromApi.cryptsenha,
    tpplataforma: userDataFromApi.tpplataforma,
    chplataforma: userDataFromApi.chplataforma,
    dsplataforma: userDataFromApi.dsplataforma,
    cdstatus: userDataFromApi.cdstatus,
    chstatus: userDataFromApi.chstatus,
    dsstatus: userDataFromApi.dsstatus,
    chtermosistema: userDataFromApi.chtermosistema,
    dstermosistema: userDataFromApi.dstermosistema,
    dsusuario: "", // Adicione aqui a lógica se necessário
    tptema: userDataFromApi.tptema,
    chtptema: userDataFromApi.chtptema,
    dstptema: userDataFromApi.dstptema,
    tpidioma: 1, // Defina um valor padrão ou obtenha da resposta
    chtpidioma: "pt", // Defina um valor padrão ou obtenha da resposta
    dstpidioma: "Português", // Defina um valor padrão ou obtenha da resposta
    ip: "", // Defina um valor padrão ou obtenha da resposta
  };
  console.log(userData);
  localStorage.setItem("user", encrypt(JSON.stringify(userData)));
  usePermissionRoleStore.getState().setPermissionRoleByCode(parseInt(userData.chtpperfil))

  const blobsAccountName = import.meta.env.VITE_BLOBS_ACCOUNTNAME;
  const blobsAccountKey = import.meta.env.VITE_BLOBS_ACCOUNTKEY;
  const blobsContainerArquivamento = import.meta.env
    .VITE_BLOBS_BLOBCONTAINERARQUIVAMENTO;

  const blobsConfig = {
    accountName: blobsAccountName,
    accountKey: blobsAccountKey,
    blobConteinerArquivamento: blobsContainerArquivamento,
  };
  console.log(blobsConfig);

  const encryptBlobsConfig = encrypt(JSON.stringify(blobsConfig));
  localStorage.setItem("blobs", encryptBlobsConfig);
  console.log(encryptBlobsConfig);

  const fingerprint = await getDeviceInfo();
  const insertFingerPrintParams = {
    identificador: fingerprint?.fingerprint,
    idusuario: userData.idusuario,
    mobile: fingerprint?.mobile,
    objeto: JSON.stringify(fingerprint),
  };
  console.log(insertFingerPrintParams);

  const responseDispositivo = await execApi({
    url: "api/keepins/v1/usuario/dispositivo",
    method: "POST",
    data: insertFingerPrintParams,
  });
  const userFingerPrintFromApi: any = responseDispositivo.data;
  console.log(userFingerPrintFromApi);

  localStorage.removeItem("semilogado");
  localStorage.removeItem("googleMfaConfigs");
  setUsuario(userData);
  setAutenticado(true);
  if (!stayInLastPage) {
    navigate("/sales");
  }
}

export const logout = async (navigate?: (path: string) => void) => {
  try {

    try {
      await handleLogoutApi()
    } catch (error) {
      console.error("Erro ao fazer logout na api:", error);
    }
    
    
    setAutenticado(false);
    setUsuario(null);
    localStorage.clear();
    if (navigate) {
      navigate("/login");
    } else {
      window.location.href = "#/login";
    }
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

async function handleLogoutApi() {
  await axios.post(`${import.meta.env.VITE_URL_AUTH_DOTCORE}api/security/logout`, {}, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.error("Erro ao fazer logout na api:", error);
    throw error;
  });
}