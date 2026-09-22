import { Check } from "lucide-react";

function EtapaSucesso() {
  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex flex-col h-full items-center justify-center space-y-4">
        <div className="flex justify-center text-white items-center rounded-full w-20 h-20 bg-gradient-to-b from-[#3D75D4] to-[#002C77]">
          <Check className="w-12 h-12" />
        </div>
        <span className="text-xl font-semibold">
          Formulário enviado com sucesso
        </span>
      </div>
    </div>
  );
}

export default EtapaSucesso;
