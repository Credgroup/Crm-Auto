import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDominios from "@/hooks/useDominios";
import { Dominio, PersonContact } from "@/types";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useHookFormMask } from "use-mask-input";

interface PhoneDialogProps {
  onAddContact: (newContact: PersonContact) => void;
}

type Inputs = {
  ddd: string;
  telefone: string;
  tpTelefoneSelect: string;
};

export default function PhoneDialog({
  onAddContact,
}: Readonly<PhoneDialogProps>) {
  const [open, setOpen] = useState(false);
  const [tpTelefone, setTpTelefone] = useState<Dominio[]>([]);
  const { data } = useDominios({ nmDominio: ["tpTelefone"] });
  const [isFormValid, setisFormValid] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      ddd: "",
      telefone: "",
      tpTelefoneSelect: "",
    },
  });

  const tpTelefoneSelect = useWatch({
    control,
    name: "tpTelefoneSelect",
  });
  const telefoneValue = useWatch({
    control,
    name: "telefone",
  });
  const dddValue = useWatch({
    control,
    name: "ddd",
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmit = (data: Inputs) => {
    const newContact: PersonContact = {
      ddd: data.ddd,
      telefone: data.telefone,
      tpTelefone: data.tpTelefoneSelect,
    };
    onAddContact(newContact);
    reset();
    setOpen(false);
  };

  const getTelefoneMask = () => {
    return tpTelefoneSelect === "371" ? "9 9999-9999" : "9999-9999";
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setTpTelefone(data[0]);
    }
  }, [data]);

  useEffect(() => {
    const phoneNumberWithoutMask = telefoneValue
      .replace("_", "")
      .replace("-", "")
      .replace(" ", "");
    const dddWithoutMask = dddValue
      .replace("_", "")
      .replace("(", "")
      .replace(")", "");

    if (
      !tpTelefoneSelect ||
      (tpTelefoneSelect == "371" && phoneNumberWithoutMask.length < 9) ||
      dddWithoutMask.length < 2 ||
      (tpTelefoneSelect == "370" && phoneNumberWithoutMask.length < 8)
    ) {
      setisFormValid(false);
      return;
    }

    setisFormValid(true);
  }, [tpTelefoneSelect, telefoneValue, dddValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button className="w-8 h-8 aspect-square" size="icon">
              <LuPlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Novo Telefone</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Telefone</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar um novo telefone
          </DialogDescription>
        </DialogHeader>

        <form className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tpTelefone">Tipo de Telefone</Label>
            <Controller
              name="tpTelefoneSelect"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="tpTelefone">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tpTelefone?.map((item) => (
                      <SelectItem
                        key={item.iddominio.toString()}
                        value={item.iddominio.toString()}
                      >
                        {item.dschave}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="w-full md:w-1/3 space-y-2">
              <Label htmlFor="ddd">DDD</Label>
              <Input
                type="text"
                id="ddd"
                {...registerWithMask("ddd", ["(99)"], {
                  required: true,
                  autoUnmask: true,
                })}
              />
              {errors.ddd && (
                <p className="text-red-500 text-sm">Este campo é obrigatorio</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                type="text"
                id="telefone"
                {...registerWithMask("telefone", [getTelefoneMask()], {
                  required: true,
                  autoUnmask: true,
                })}
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm">Este campo é obrigatorio</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isFormValid}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
