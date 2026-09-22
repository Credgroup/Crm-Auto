import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { EnviarPropostaMenu } from "@/components/EnviarPropostaMenu";
import { Chip } from "@/components/Chip/Chip";

interface Step {
  step: number;
}

interface Props {
  step: Step;
  nextStep: (step: number, totalStep: number, description: string) => void;
}

interface Chip {
  id: number;
  nome: string;
  disabled: boolean;
}

function EtapaInteresse({ nextStep }: Readonly<Props>) {
  const [disp, setDisp] = useState<Chip[]>([
    { id: 0, nome: "Seguro evento", disabled: false },
    { id: 1, nome: "Seguro equipamento", disabled: false },
    { id: 2, nome: "Auto Frota", disabled: false },
  ]);

  const [select, setSelect] = useState<Chip[]>([]);
  const [sucesso, setSucesso] = useState<boolean>(false);

  const handleClick = (value: string | number) => {
    setDisp((prev) =>
      prev.map((item) =>
        item.id === value ? { ...item, disabled: true } : item
      )
    );

    setSelect((prev) => {
      const selectedItem = disp.find((item) => item.id === value);
      return selectedItem ? [...prev, selectedItem] : prev;
    });
  };

  const handleDelete = (value: string | number) => {
    setSelect((prev) => prev.filter((item) => item.id !== value));
    setDisp((prev) =>
      prev.map((item) =>
        item.id === value ? { ...item, disabled: false } : item
      )
    );
  };

  useEffect(() => {
    console.log(disp);
    console.log(select);
  }, [disp, select]);

  return sucesso ? (
    <div className="flex flex-col h-full items-center justify-center space-y-4">
      <div className="flex justify-center text-white items-center rounded-full w-20 h-20 bg-gradient-to-b from-[#3D75D4] to-[#002C77]">
        <Check className="w-12 h-12" />
      </div>
      <span className="text-xl font-semibold">
        Cadastro efetuado com sucesso
      </span>
      <EnviarPropostaMenu />
    </div>
  ) : (
    <div>
      <div className="mb-2">
        <div className="mb-2">Disponíveis</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {disp.map((item) => {
            return [
              <Chip
                key={item.id}
                value={item.id}
                label={item.nome}
                variant="outlined"
                disabled={item.disabled}
                onClick={handleClick}
              />,
            ];
          })}
        </div>
      </div>
      <div className="mb-2">
        <div className="mb-2">Selecionados</div>
        <div className="flex gap-2 mb-8">
          {select.length > 0 ? (
            select.map((item) => {
              return [
                <Chip
                  key={item.id}
                  value={item.id}
                  label={item.nome}
                  variant="outlined"
                  disabled={item.disabled}
                  onDelete={handleDelete}
                />,
              ];
            })
          ) : (
            <span>Nenhum seguro selecionado</span>
          )}
        </div>
      </div>
      <div className="flex w-full justify-between">
        <Button
          // disabled={load ? true : false}
          onClick={() => nextStep(2, 4, "Dados de contato")}
        >
          Voltar
        </Button>
        <Button type="submit" onClick={() => setSucesso(true)}>
          Cadastrar
        </Button>
      </div>
    </div>
  );
}

export default EtapaInteresse;
