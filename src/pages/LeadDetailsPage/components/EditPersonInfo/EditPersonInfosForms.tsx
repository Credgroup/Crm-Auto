import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { obterIniciais } from "@/lib/obterIniciais";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuUserRound } from "react-icons/lu";
import { useHookFormMask } from "use-mask-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Dominio, Person } from "@/types";
import useDominios from "@/hooks/useDominios";
import { format, parse } from "date-fns";

interface Inputs {
  nome: string;
  sexo: string;
  estadoCivil: string;
  cpf: string;
  dtNascimento: string;
  avatar: File;
}

type EditPersonInfosFormsProps = {
  person: Partial<Person | null>;
  setFormController: (data: Partial<Person | null>) => void;
  setPerson: Dispatch<SetStateAction<Partial<Person | null>>>;
};

export default function EditPersonInfosForms({
  person,
  setFormController,
}: Readonly<EditPersonInfosFormsProps>) {
  const [profile, setProfile] = useState("");
  const load = true;

  const [tpSexo, setTpSexo] = useState<Dominio[]>([]);
  const [tpEstadoCivil, setTpEstadoCivil] = useState<Dominio[]>([]);
  const { data } = useDominios({ nmDominio: ["tpSexo", "tpEstadoCivil"] });

  useEffect(() => {
    if (data && data.length > 0) {
      setTpSexo(data[0]);
      setTpEstadoCivil(data[1]);
    }
  }, [data]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfile(fileURL);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      nome: person?.nome,
      sexo: person?.tpSexo?.toString(),
      estadoCivil: person?.tpEstadoCivil?.toString(),
      cpf: person?.cpf ? person.cpf.toString() : "",
      dtNascimento:
        person?.dataNascimento &&
        format(new Date(person.dataNascimento), "dd/MM/yyyy"),
    },
  });

  useEffect(() => {
    console.log(person);
  });

  const registerWithMask = useHookFormMask(register);

  function getFormData(data: Inputs) {
    console.log(data.dtNascimento);
    const personData: Partial<Person> = {
      nome: data.nome,
      tpSexo: parseInt(data.sexo),
      tpEstadoCivil: parseInt(data.estadoCivil),
      cpf: parseInt(data.cpf),
      dataNascimento: format(
        parse(data.dtNascimento, "dd/MM/yyyy", new Date()),
        "yyyy/MM/dd"
      ),
    };

    console.log(personData);
    setFormController({ ...personData });
  }

  return (
    <form onSubmit={handleSubmit(getFormData)}>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Label
          htmlFor="profilePic"
          className="flex justify-center items-center w-full md:justify-start md:w-1/3"
        >
          <Avatar className="w-full h-auto max-w-40 md:max-w-none aspect-square rounded-full">
            <AvatarImage
              src={profile ?? "/user.png"}
              alt={watch("nome") ?? "Avatar"}
            />
            <AvatarFallback className="text-2xl rounded-full">
              {watch("nome") ? (
                obterIniciais(watch("nome"))
              ) : (
                <LuUserRound
                  size={64}
                  className="text-zinc-300 dark:text-zinc-700"
                />
              )}
            </AvatarFallback>
          </Avatar>
          <Input
            className="hidden"
            id="avatarPic"
            type="file"
            {...register("avatar", {
              onChange(event) {
                handleFileChange(event);
              },
            })}
          />
          {errors.avatar && (
            <span className="text-rose-400">Este campo é obrigatório</span>
          )}
        </Label>
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <div className="w-full">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              {...register("nome", { required: true })}
            />
            {errors.nome && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              {...registerWithMask("cpf", ["999.999.999-99"], {
                required: true,
                autoUnmask: true,
              })}
            />
            {errors.cpf && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="sexo">Sexo</Label>
            <Controller
              control={control}
              name="sexo"
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="sexo" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tpSexo &&
                      tpSexo.length > 0 &&
                      tpSexo.map((item) => (
                        <SelectItem
                          key={(item.iddominio + item.nmdominio).toString()}
                          value={item.iddominio.toString()}
                        >
                          {item.dschave}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sexo && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="estadoCivil">Estado civíl</Label>
            <Controller
              control={control}
              name="estadoCivil"
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="estadoCivil" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tpEstadoCivil &&
                      tpEstadoCivil.length > 0 &&
                      tpEstadoCivil.map((item) => (
                        <SelectItem
                          key={(item.iddominio + item.nmdominio).toString()}
                          value={item.iddominio.toString()}
                        >
                          {item.dschave}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.estadoCivil && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="dtNascimento">Data de nascimento</Label>
            <Input
              id="dtNascimento"
              type="text"
              {...registerWithMask("dtNascimento", ["99/99/9999"], {
                required: true,
              })}
            />
            {errors.dtNascimento && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          className="bg-[#002c77] hover:bg-blue-950 text-white w-full md:max-w-36"
          disabled={!load || !isValid}
          type="submit"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}
