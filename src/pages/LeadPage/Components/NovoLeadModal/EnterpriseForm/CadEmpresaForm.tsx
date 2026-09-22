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
import { Dominio, Enterprise } from "@/types";
import { useOperationStore } from "@/store/operationStore";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import useDominios from "@/hooks/useDominios";

const cadEmpresaSchema = z.object({
  nmRazaoSocial: z.string().min(1, "Razão Social é obrigatória"),
  nmFantasia: z.string().min(1, "Nome Fantasia é obrigatório"),
  nrCNPJ: z
    .string()
    .min(14, "CNPJ deve ter no mínimo 14 números")
    .max(18, "CNPJ inválido"),
  nrInscricaoEstadual: z
    .string()
    .min(9, "Número de Inscrição Estadual é obrigatório")
    .max(9, "No máximo 9 caracteres"),
  tpCNPJ: z.string().min(1, "Tipo de CNPJ é obrigatório"),
  cdStatus: z.number().optional(),
  avatar: z.any(),
});

type CadEmpresaFormProps = {
  setFormController: () => void;
  setEnterprise: Dispatch<SetStateAction<Partial<Enterprise | null>>>;
};

export default function CadEmpresaForm({
  setEnterprise,
  setFormController,
}: Readonly<CadEmpresaFormProps>) {
  const [profile, setProfile] = useState("");
  const load = true;

  const { data } = useDominios({ nmDominio: ["tpCNPJ"] });
  const [tpCNPJ, setTpCNPJ] = useState<Dominio[]>([]);
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
  } = useForm<z.infer<typeof cadEmpresaSchema>>({
    resolver: zodResolver(cadEmpresaSchema),
    mode: "onChange",
  });

  const registerWithMask = useHookFormMask(register);

  const idOperation = useOperationStore((state) => state.idOperation);

  function getFormData(data: z.infer<typeof cadEmpresaSchema>) {
    if (!idOperation) {
      console.error("Operação não selecionada");
      toast.error("Selecione uma operação para cadastrar empresa");
      return;
    }
    const enterpriseData: Partial<Enterprise> = {
      nmFantasia: data.nmFantasia,
      nmRazaoSocial: data.nmRazaoSocial,
      nrCNPJ: data.nrCNPJ,
      nrInscricaoEstadual: data.nrInscricaoEstadual.toString(),
      tpCNPJ: parseInt(data.tpCNPJ),
      idOperacao: parseInt(idOperation),
    };
    setEnterprise(enterpriseData);
    console.log(enterpriseData);
    setFormController();
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setTpCNPJ(data[0]);
    }
  }, [data]);

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
              alt={watch("nmFantasia")}
            />
            <AvatarFallback className="text-2xl rounded-full">
              {watch("nmFantasia") ? (
                obterIniciais(watch("nmFantasia"))
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
              {...register("nmFantasia", { required: true })}
            />
            {errors.nmFantasia && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="tpCNPJ">Tipo de CNPJ</Label>
            <Controller
              control={control}
              name="tpCNPJ"
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="tpCNPJ" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(tpCNPJ) &&
                      tpCNPJ?.map((item) => (
                        <SelectItem
                          key={item.iddominio}
                          value={item.iddominio.toString()}
                        >
                          {item.dschave}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tpCNPJ && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="nrCNPJ">Número de CNPJ</Label>
            <Input
              id="nrCNPJ"
              type="text"
              {...registerWithMask("nrCNPJ", ["99999999/9999-99"], {
                required: true,
                autoUnmask: true,
              })}
            />
            {errors.nrCNPJ && (
              <span className="text-rose-400">
                Campo obrigatório não preenchido ou incorreto
              </span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="nmRazaoSocial">Razão Social</Label>
            <Input
              id="nmRazaoSocial"
              type="text"
              {...register("nmRazaoSocial", { required: true })}
            />
            {errors.nmRazaoSocial && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="nrInscricaoEstadual">
              Número de Inscrição Estadual
            </Label>
            <Input
              id="nrInscricaoEstadual"
              type="text"
              {...register("nrInscricaoEstadual", {
                required: true,
                maxLength: 9,
              })}
              maxLength={9}
            />
            {errors.nrInscricaoEstadual && (
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
