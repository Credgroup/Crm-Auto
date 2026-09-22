import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useAcceptTerms } from "@/hooks/useAcceptTerms";
// import { loadUserState } from "@/hooks/useLogin";
// import { useAuthStore } from "@/store/autenticadoStore";
// import { useUsuarioStore } from "@/store/usuarioStore";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function Terms() {
  const navigate = useNavigate();
  // const setAutenticado = useAuthStore((state) => state.setAutenticado);
  // const setUsuario = useUsuarioStore((state) => state.setUsuario);

  function refuseTerms() {
    localStorage.clear();
    navigate("/login");
  }

  const { acceptTerms, isPending } = useAcceptTerms(() => {
    console.log("Termos aceitos com sucesso!");
    toast({ title: "Termos aceitos com sucesso!", description: "Faça login novamente para entrar!" });

    // loadUserState({ navigate, setAutenticado, setUsuario });
    navigate("/login")
  });

  return (
    <div className="max-w-[350px] w-full">
      <div className="w-full text-center mb-10 -mt-10">
        <h1 className="text-xl mb-1 font-semibold">Termos de uso</h1>
        <p>Aceite os termos de uso para acessar sua conta.</p>
      </div>
      <div className="relative flex justify-center items-center flex-col">
        <ScrollArea className="w-full h-64 max-h-72 bg-muted p-2 rounded-md">
          <p className="dark:text-zinc-300 text-zinc-800">
            O acesso a este sistema é restrito a usuários autorizados que, no
            presente ato, expressamente concordam que a permissão de uso do
            sistema não significa, em hipótese alguma, a transferência da
            propriedade intelectual do Software para o usuário. O uso não
            autorizado deste sistema sujeitará o infrator a consequências
            legais, civis, criminais ou administrativas.
          </p>
        </ScrollArea>
        <div className="flex gap-2 mt-5 w-full">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => refuseTerms()}
          >
            Recusar
          </Button>
          <Button
            className="w-full"
            onClick={() => acceptTerms()}
            disabled={isPending}
          >
            {isPending ? (
              <LuLoaderCircle className="animate-spin" />
            ) : (
              "Prosseguir"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
