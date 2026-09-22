import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { v4 } from "uuid";

interface Props {
  onSuccess?: (etapa: number) => void;
}

interface Mensagem {
  id: number;
  texto: string;
}

function EtapaTemplate({ onSuccess }: Readonly<Props>) {
  const [seletcMensagem, setSeletcMensagem] = useState<Mensagem | null>(null);

  const mensagem = [
    {
      id: 0,
      texto:
        "Ola @nome, segue o link do formulário para montar duas cotações de seguro evento e seguro equipamento. {{link_form}}",
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <SheetHeader>
          <SheetTitle className="text-2xl">Enviar proposta</SheetTitle>
          <SheetDescription className="text-md">
            Selecione o meio de contato com o lead{" "}
            <span className="font-bold">Gilberto Junio</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col space-y-4">
          <div>
            <Label>Origem</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um contato de origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel></SelectLabel>
                  <SelectItem value="1">+55 (11) 99999-9999</SelectItem>
                  <SelectItem value="2">+55 (11) 98888-8888</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            {!seletcMensagem ? (
              <>
                <Label>Mensagem template</Label>
                <Select
                  onValueChange={(value) =>
                    setSeletcMensagem(JSON.parse(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      {mensagem.map((item) => {
                        return [
                          <SelectItem key={v4()} value={JSON.stringify(item)}>
                            {item.texto}
                          </SelectItem>,
                        ];
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Mensagem template</Label>
                  <Textarea rows={3} value={seletcMensagem.texto} readOnly />
                  <span className="text-sm">
                    'link_form' é a variável que contém o link do formulário do
                    seu produto
                  </span>
                </div>
                <Button
                  className="w-full bg-[#002c77] hover:bg-blue-950 text-white"
                  onClick={() => onSuccess?.(3)}
                >
                  Enviar Template
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SheetFooter className="flex flex-col">
        <SheetClose asChild>
          <Button variant="secondary" className="w-full">
            Cancelar
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}

export default EtapaTemplate;
