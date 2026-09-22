import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOperationStore } from "@/store/operationStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Person, PersonContact, PersonEmail } from "@/types";
import PhoneDialog from "../../PhoneDialog";
import EmailDialog from "../../EmailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { LuDelete } from "react-icons/lu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Inputs = {
  idExterno: string;
};

type BindPersonOperationFormProps = {
  person: Partial<Person | null>;
  setFormController: () => void;
  setPerson: Dispatch<SetStateAction<Partial<Person | null>>>;
};

export default function BindPersonOperationForm({
  setFormController,
  person,
  setPerson,
}: Readonly<BindPersonOperationFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: "onBlur",
  });

  const [personContacts, setPersonContacts] = useState<PersonContact[]>([]);
  const [personEmails, setPersonEmails] = useState<PersonEmail[]>([]);
  const idOperationSelected = useOperationStore((state) => state.idOperation);

  function onSubmit(data: Inputs) {
    console.log(data);
    if (!idOperationSelected) {
      toast.error("Selecione uma operação");
      return;
    }
    const personData: Partial<Person> = {
      ...person,
      idExterno: data.idExterno,
      email: personEmails,
      contato: personContacts,
    };

    console.log(personData);
    setPerson(personData);
  }

  useEffect(() => {
    if (person?.idExterno) {
      setFormController();
    }
  }, [person]);

  function handleRemoveContact(indexToRemove: number) {
    setPersonContacts((prev) => prev.filter((_, i) => i !== indexToRemove));
  }
  function handleRemoveEmail(indexToRemove: number) {
    setPersonEmails((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex justify-between gap-2 w-full flex-wrap">
          <div className="w-full md:w-[100%]">
            <Label htmlFor="idExterno">Id Externo</Label>
            <Input
              id="idExterno"
              type="text"
              {...register("idExterno", { required: true })}
            />
            {errors.idExterno && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <Card className="w-full md:w-[49%]">
            <CardContent className="p-4">
              <div className="flex justify-start items-center gap-3 mb-6">
                <Label className="text-lg font-semibold">Telefones</Label>
                <PhoneDialog
                  onAddContact={(contact) =>
                    setPersonContacts((prev) => [...prev, contact])
                  }
                />
              </div>
              <div>
                {personContacts.length > 0 ? (
                  personContacts?.map((contact, index) => (
                    <div
                      key={`${contact.ddd}-${contact.telefone}-${index}`}
                      className="flex gap-2 items-center justify-between mb-2"
                    >
                      <Input
                        type="text"
                        value={`${contact.ddd} ${contact.telefone}`}
                        readOnly
                        disabled
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            type="button"
                            className="w-9 h-9 aspect-square"
                            onClick={() => handleRemoveContact(index)}
                          >
                            <LuDelete />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remover</TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <span>Lista de telefone vazia.</span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-[49%]">
            <CardContent className="p-4">
              <div className="flex justify-start items-center gap-3 mb-6">
                <Label className="text-lg font-semibold">Emails</Label>
                <EmailDialog
                  onAddEmail={(email) =>
                    setPersonEmails((prev) => [...prev, email])
                  }
                />
              </div>
              <div>
                {personEmails.length > 0 ? (
                  personEmails?.map((email, index) => (
                    <div
                      key={`${email.dsEmail}-${index}`}
                      className="flex gap-2 items-center justify-between mb-2"
                    >
                      <Input
                        type="text"
                        value={email.dsEmail}
                        readOnly
                        disabled
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            type="button"
                            className="w-9 h-9 aspect-square"
                            onClick={() => handleRemoveEmail(index)}
                          >
                            <LuDelete />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remover</TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <span>Lista de emails vazia.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full flex justify-end mt-4 gap-4">
        <Button
          className="bg-[#002c77] hover:bg-blue-950 text-white w-full md:max-w-36"
          disabled={
            !(isValid && personEmails.length > 0 && personContacts.length > 0)
          }
          type="submit"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}
