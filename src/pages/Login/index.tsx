import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginPropsSchema,
  loadUserState,
  loginSchema,
  useLogin,
  userAcceptedTerms,
  userConfirmCode,
  userHasTemporaryPassword,
} from "@/hooks/useLogin";
import { useAuthStore } from "@/store/autenticadoStore";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useUsuarioStore } from "@/store/usuarioStore";
import { LuLoaderCircle } from "react-icons/lu";
import { MercedesLogo } from "@/components/Branding/MercedesLogo";

export default function Login() {
  const setAutenticado = useAuthStore((state) => state.setAutenticado);
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const [passInputType, setPassInputType] = useState<"text" | "password">(
    "password"
  );
  const navigate = useNavigate();
  const { loginFn, isPending } = useLogin(() => {
    if (!userConfirmCode()) {
      console.log("precisa digitar o código");
      navigate("/code");
      return;
    }

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPropsSchema>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  function handleLogin(data: LoginPropsSchema) {
    loginFn(data);
  }
  function handleShowHidePass(value: CheckedState) {
    if (value) {
      setPassInputType("text");
    } else {
      setPassInputType("password");
    }
  }

  useEffect(() => {
    setAutenticado(false);
    setUsuario(null);
    localStorage.clear();
  }, []);

  return (
    <div className="max-w-[350px] w-full">
      <div className="w-full text-center mb-8 -mt-4 flex justify-center flex-col items-center">
        <div className="mb-4 flex items-center justify-center">
          <MercedesLogo variant="vertical" size="lg" />
        </div>
        <p className="text-sm text-zinc-500 max-w-xs">
          Financiamento, seguros e serviços em uma jornada digital.
        </p>
      </div>
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Label htmlFor="email-input">E-mail</Label>
        <Input
          type="email"
          id="email-input"
          placeholder="email@exemplo.com.br"
          {...register("user_email")}
          className={clsx(
            errors.user_email &&
              "border-red-500 text-red-400 placeholder:text-red-500 bg-red-900 bg-opacity-20"
          )}
        />
        {errors.user_email && (
          <span className="text-red-500 text-left w-full">
            {errors.user_email.message}
          </span>
        )}
        <Label htmlFor="pass-input">Senha</Label>
        <Input
          type={passInputType}
          id="pass-input"
          placeholder="Digite sua senha"
          className={clsx(
            errors.user_pass &&
              "border-red-500 text-red-400 placeholder:text-red-500 bg-red-900 bg-opacity-20"
          )}
          {...register("user_pass")}
        />
        {errors.user_pass && (
          <span className="text-red-500 text-left w-full">
            {errors.user_pass.message}
          </span>
        )}
        <Label
          htmlFor="check-showhide-checkbox"
          className="flex gap-2 items-center"
        >
          <Checkbox
            onCheckedChange={(e) => handleShowHidePass(e)}
            id="check-showhide-checkbox"
          />
          {passInputType == "password" ? "Mostrar senha" : "Esconder senha"}
        </Label>
        <Button className="mt-3" type="submit" disabled={isPending}>
          {!isPending && <>Enviar</>}
          {isPending && <LuLoaderCircle className="animate-spin" />}
        </Button>
        <Link to="/resetSenha" className="text-xs hover:underline text-center">
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
}
