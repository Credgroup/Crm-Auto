import { Button } from "@/components/ui/button";
import GoogleMfaLogo from "@/assets/images/googleMfaIconCompact.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { decrypt } from "@/hooks/useCrypt";
import { LuArrowLeft, LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router";
import {
  loadUserState,
  userAcceptedTerms,
  userHasTemporaryPassword,
} from "@/hooks/useLogin";
import { useReSendCode, useSendCode } from "@/hooks/useSendCode";
import { useAuthStore } from "@/store/autenticadoStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import { MfaInstructionsDialog } from "@/components/MfaInstructionsDialog";

export default function AccessCode() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const setAutenticado = useAuthStore((state) => state.setAutenticado);
  const [qrCode, setQrCode] = useState<null | undefined | string>(null);
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const [typeMfa, setTypeMfa] = useState("");
  const [code, setCode] = useState("");

  const { sendCode, isPending, isError } = useSendCode(() => {
    console.log("Codigo enviado com sucesso!");

    if (userHasTemporaryPassword()) {
      console.log("precisa definir nova senha");
      navigate("/resetSenha/new");
      return;
    }

    if (!userAcceptedTerms()) {
      console.log("precisa aceitar os termos de uso");
      navigate("/terms");
      return;
    }

    loadUserState({ navigate, setAutenticado, setUsuario });
  });

  const { reSendCode, isPending: isReSendCodePending } = useReSendCode(() => {
    toast({ title: "Codigo reenviado com sucesso" });
  });

  useEffect(() => {
    if (code.length === 6) {
      const userEncrypt = localStorage.getItem("user");
      if (!userEncrypt) {
        toast({ title: "Não existe user no localStorage!" });
        return;
      }

      sendCode(code);
    }
  }, [code]);

  useEffect(() => {
    const timeoutClearCode = setTimeout(() => {
      setCode("");
    }, 1500);

    return () => {
      clearTimeout(timeoutClearCode);
    };
  }, [isError]);

  useEffect(() => {
    const googleMfaConfigsExist = localStorage.getItem("googleMfaConfigs");
    console.log(googleMfaConfigsExist);
    if (googleMfaConfigsExist) {
      let googleConfigs = JSON.parse(decrypt(googleMfaConfigsExist));
      console.log(googleConfigs);
      setQrCode(googleConfigs.qrCode);
      setTypeMfa("google");
    } else {
      setTypeMfa("email");
    }
  }, []);

  if (typeMfa == "email") {
    return (
      <div className="max-w-[350px] w-full">
        <div className="w-full text-center mb-10 -mt-10">
          <h1 className="text-xl mb-1 font-semibold">Código de segurança</h1>
          <p>insira o código que enviamos para o seu email.</p>
        </div>
        <div className="relative flex justify-center items-center">
          <div
            className={clsx(
              "transition-all",
              isPending ? "opacity-20" : "opacity-1"
            )}
          >
            <InputOTP
              maxLength={6}
              onChange={(e) => setCode(e)}
              disabled={isPending}
              value={code}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div
            className={clsx(
              "absolute transition-all",
              isPending ? "opacity-1" : "opacity-0"
            )}
          >
            <LuLoaderCircle className="animate-spin" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            disabled={false}
            className="w-full"
          >
            <LuArrowLeft className="-ml-2" />
            Voltar
          </Button>
          <p className="text-xs text-center ">
            Não recebeu o código?{" "}
            <Button
              variant="link"
              className="text-blue-500 text-xs px-1"
              onClick={() => reSendCode()}
              disabled={isPending || isReSendCodePending}
            >
              Reenviar código
            </Button>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="max-w-[350px] w-full">
        <div className="w-full text-center mb-10 -mt-10">
          <h1 className="text-xl mb-1 font-semibold">Código de segurança</h1>
          <p>Acesse o autenticador para obter seu código</p>
          <p className="mb-5">
            Não lembra como fazer?
            <MfaInstructionsDialog alradyScan={!!qrCode} />
          </p>
          {qrCode ? (
            <img
              className="w-full h-full rounded-md"
              src={qrCode}
              alt="Qr code para escanear e ter acesso ao código"
            />
          ) : (
            <img
              className="w-full h-full rounded-md"
              src={GoogleMfaLogo}
              alt="Foto do logo do google authenticator"
            />
          )}
        </div>
        <div className="relative flex justify-center items-center">
          <div
            className={clsx(
              "transition-all",
              isPending ? "opacity-20" : "opacity-1"
            )}
          >
            <InputOTP
              maxLength={6}
              onChange={(e) => setCode(e)}
              disabled={isPending}
              value={code}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div
            className={clsx(
              "absolute transition-all",
              isPending ? "opacity-1" : "opacity-0"
            )}
          >
            <LuLoaderCircle className="animate-spin" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            disabled={false}
            className="w-full"
          >
            <LuArrowLeft className="-ml-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }
}
