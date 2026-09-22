import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useResetPassword } from "@/hooks/useResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const schema = z.object({
    recover_email: z
      .string()
      .trim()
      .email({ message: "Digite um email válido!" }),
  });
  type formType = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formType>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const emailValue = watch("recover_email");

  const { resetPassword, isPending } = useResetPassword(() => {
    toast({
      title: "Email enviado!",
      description: `Enviamos um email para o endereço: ${emailValue.trim()}, contendo as instruções para recuperar sua senha.`,
    });
  });

  const handleClick = () => {
    handleSendEmail();
  };

  const handleSendEmail = handleSubmit((data) => {
    resetPassword(data);
  });

  return (
    <div className="max-w-[350px] w-full">
      <div className="w-full text-center mb-10 -mt-10">
        <h1 className="text-xl mb-1 font-semibold">Recuperar Senha</h1>
        <p>
          insira seu email para receber as instruções de recuperação de senha.
        </p>
      </div>
      <form className="flex flex-col gap-3 w-full">
        <Label htmlFor="email-input">E-mail</Label>
        <Input
          type="email"
          placeholder="email@examplo.com"
          id="email-input"
          className={clsx(
            errors.recover_email &&
              "border-red-500 text-red-400 placeholder:text-red-500 bg-red-900 bg-opacity-20"
          )}
          {...register("recover_email", { required: true })}
        />
        <Button
          type="submit"
          onClick={() => handleClick()}
          disabled={
            !(
              emailValue &&
              emailValue.length > 0 &&
              !errors.recover_email &&
              !isPending
            )
          }
        >
          Enviar
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
        >
          <LuArrowLeft className="-ml-5" />
          Voltar
        </Button>
      </form>
    </div>
  );
}
