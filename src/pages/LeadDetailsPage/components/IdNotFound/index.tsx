import { Button } from "@/components/ui/button";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function IdNotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-2">ID não encontrado</h1>
      <p className="text-gray-500 mb-4">
        O ID que você está procurando não foi encontrado.
      </p>
      <Button onClick={() => navigate("/lead")}>
        <LuArrowLeft />
        Voltar
      </Button>
    </div>
  );
}
