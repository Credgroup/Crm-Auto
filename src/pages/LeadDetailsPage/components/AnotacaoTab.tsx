import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { LuLoader } from "react-icons/lu";

export default function AnotacaoTab() {
  const isLoading = false;
  const isMock = true;
  const notes = [
    {
      id: 3,
      note: "Envio de Contação",
      data: "04/01/2025 - 18:17:12",
      usuario: "Itamar Soares",
    },
    {
      id: 2,
      note: "Cliente respondeu o formulario",
      data: "28/12/2024 - 16:20:56",
      usuario: "Lucas Gomes",
    },
    {
      id: 1,
      note: "Envio de proposta",
      data: "20/12/2024 - 12:35:27",
      usuario: "Renan Lima",
    },
  ];


  return (
    <div className="w-full">
      {
        isMock ? (
          <>
            Em desenvolvimento
          </>
        ) : (
          <>
            <div className="flex mb-4 space-x-4 justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button>Adicionar Anotação</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px]">
                  <Textarea id="score" rows={6} className="resize-none" />
                  <Button className="w-full mt-2">
                    {isLoading ? (
                      <LuLoader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Anotar
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            <ScrollArea className="h-80 w-full rounded-md border !p-0 !space-y-0">
              <div className="p-4">
                {notes.map((note) => (
                  <ol
                    key={note.id}
                    className="relative border-s border-[var(--cor-principal)] dark:border-white"
                  >
                    <div className="absolute w-3 h-3 -start-1.5 bg-[var(--cor-principal)] dark:bg-white rounded-full mt-8 border border-white"></div>
                    <li className="flex flex-col ms-4 p-2 rounded-md hover:bg-muted/90">
                      <div key={note.id} className="text-sm">
                        {note.note}
                      </div>
                      <div className="text-sm text-gray-500">{note.usuario}</div>
                      <div className="text-sm text-gray-500">{note.data}</div>
                    </li>
                  </ol>
                ))}
              </div>
            </ScrollArea>
          </>
        )
      }
    </div>
  );
}
