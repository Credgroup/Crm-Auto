import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { userAcceptedTerms } from "@/hooks/useLogin";
import {
  NewSenhaType,
  newSenhaSchema,
  useCreateNewPassword,
} from "@/hooks/useResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function CreateNewPassword() {
  const [confirmSenhaValue, setConfirmSenhaValue] = useState<string>("");
  const [senhaAntigaValue, setSenhaAntigaValue] = useState<string>("");
  const [disableSendButton, setDisableSendButton] = useState<boolean>(true);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<NewSenhaType>({
    mode: "onBlur",
    resolver: zodResolver(newSenhaSchema),
  });

  const newSenhaValue = watch("new_pass");

  const { createNewPassword, isPending } = useCreateNewPassword(
    senhaAntigaValue, 
    () => {
    console.log("Senha redefinida com sucesso!");

    toast({
      title: "Senha redefinida com sucesso!",
      description:
        "Lembre-se de anotar sua nova senha em um local seguro para não perdê-la",
    });

    if (!userAcceptedTerms()) {
      console.log("precisa aceitar os termos de uso");
      navigate("/terms");
      return;
    }

    toast({
      title: "Senha redefinida com sucesso!",
      description: "Faça login novamente para entrar!"
    });
    navigate("/login");

  });

  useEffect(() => {
    if (confirmSenhaValue.length >= 8 && confirmSenhaValue == newSenhaValue) {
      setDisableSendButton(false);
      return;
    }
    setDisableSendButton(true);
  }, [newSenhaValue, confirmSenhaValue]);

  const handleClick = () => {
    handleSendEmail();
  };

  const handleSendEmail = handleSubmit((data) => {
    createNewPassword(data);
  });

  return (
    <div className=" max-w-[350px] w-full">
      <div className="w-full text-center mb-10 -mt-10">
        <h1 className="text-xl mb-1 font-semibold">Criar nova senha</h1>
        <p>
          Sua nova senha deve conter: letras{" "}
          <b>maiúsculas, minúsculas, simbolos e números</b>.
        </p>
      </div>
      <form className="flex flex-col gap-2">
        <label>
          <Input
            type="password"
            placeholder="Digite a sua senha temporária"
            value={senhaAntigaValue}
            onChange={(e) => setSenhaAntigaValue(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <div className="relative">
            <Input
              type="password"
              placeholder="Digite sua nova senha"
              {...register("new_pass", { required: true })}
              className={clsx(
                errors.new_pass &&
                  "border-red-500 text-red-400 placeholder:text-red-500 bg-red-900 bg-opacity-20"
              )}
            />
            <PasswordStrengthMeter
              password={newSenhaValue || ""}
              className="absolute right-3 top-[1px]"
            />
          </div>
          {errors.new_pass && (
            <span className="text-red-500 text-left w-full">
              {errors.new_pass.message}
            </span>
          )}
        </label>
        <label>
          <Input
            type="password"
            placeholder="Confirme sua senha"
            onChange={(e) => setConfirmSenhaValue(e.target.value)}
            disabled={
              !!errors.new_pass || !(newSenhaValue && newSenhaValue.length > 0)
            }
          />
          {disableSendButton &&
            confirmSenhaValue.length > 0 &&
            newSenhaValue &&
            newSenhaValue.length > 0 && (
              <span className="text-red-500 text-left w-full">
                As senhas não são iguais
              </span>
            )}
        </label>
        <Button
          type="button"
          disabled={disableSendButton || isPending}
          onClick={() => handleClick()}
        >
          Enviar
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          <LuArrowLeft className="-ml-5" />
          Voltar
        </Button>
      </form>
    </div>
  );
}
