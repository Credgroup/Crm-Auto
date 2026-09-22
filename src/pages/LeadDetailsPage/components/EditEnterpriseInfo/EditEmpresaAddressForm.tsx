import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editarEmpresa } from "@/hooks/useCadEnterprise";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { Enterprise } from "@/types";
import { toast } from "sonner";

type Inputs = {
  nrCep: string;
  nmLogradouro: string;
  nmBairro: string;
  nmCidade: string;
  cdUF: string;
  nrLogradouro: number; 
};

type EditEmpresaAddressFormProps = {
  enterprise: Partial<Enterprise | null>;
  editEnterprise: Partial<Enterprise | null>;
  setEnterprise: Dispatch<SetStateAction<Partial<Enterprise> | null>>;
  setFormController: () => void;
};

export default function EditEmpresaAddressForm({
  enterprise,
  setFormController,
  editEnterprise,
}: Readonly<EditEmpresaAddressFormProps>) {
  console.log(enterprise)
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      nrCep: enterprise?.nrCEP ?? "",
      nmLogradouro: enterprise?.nmLogradouro ?? "teste",
      nmBairro: enterprise?.nmBairro ?? "",
      nmCidade: enterprise?.nmCidade ?? "",
      cdUF: enterprise?.cdUF ?? "",
      nrLogradouro: enterprise?.nrLogradouro
  ? Number(enterprise.nrLogradouro)
  : undefined,
      // nrLogradouro: enterprise?.nrLogradouro != null ? number(enterprise.nrLogradouro): "",
    },
  });
  const registerWithMask = useHookFormMask(register);
  const { mutate } = useMutation({
    mutationFn: (data: Partial<Enterprise> & { adicional: any }) =>
      editarEmpresa(data),
    onSuccess: (data) => {
      console.log("success", data);
      toast.success(JSON.stringify(data));
      setFormController();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.message || "Erro ao cadastrar empresa!");
    },
  });

  const onSubmit = (data: Inputs) => {
  const enterpriseData = {
    ...data,
    //nrCep: data.nrCep.padStart(8, "0"),
    nrCep: Number(data.nrCep),
  };
 console.log("Valor da data no momento do submit")
 console.log(data)
 mutate({ ...editEnterprise, ...enterpriseData as any });
};

  const values = watch();

  const algumPreenchido = Object.values(values).some((v) => !!v && v !== "");

  const handleSearchCep = async (cep: string) => {
    axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((res) => {
      setValue("nmBairro", res.data.bairro);
      setValue("nmLogradouro", res.data.logradouro);
      setValue("nmCidade", res.data.localidade);
      setValue("cdUF", res.data.uf);
      setValue("nrLogradouro", res.data.numero);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex justify-between gap-2 w-full flex-wrap">
          <div className="w-full md:w-[49%]">
            <Label htmlFor="cep-input">CEP</Label>
            <Input
              id="cep-input"
              type="text"
              {...registerWithMask("nrCep", ["99999-999"], {
                maxLength: 9,
                autoUnmask: true,
                onChange(event) {
                  if (event.target.value.length === 8) {
                    handleSearchCep(event.target.value);
                  }
                },
              })}
            />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" type="text" {...register("nmLogradouro")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" type="text" {...register("nmBairro")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" type="text" {...register("nmCidade")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="estado">Estado</Label>
            <Input id="estado" type="text" {...register("cdUF")} />
          </div>
          <div className="w-full md:w-[49%]">
            <Label htmlFor="estado">Número</Label>
            <Input id="numero" type="number" {...register("nrLogradouro", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mt-4 gap-4">
        <Button
          className="bg-[#002c77] hover:bg-blue-950 text-white w-full md:max-w-36"
          disabled={!algumPreenchido}
          type="submit"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}
