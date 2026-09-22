import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cadastrarEmpresa } from "@/hooks/useCadEnterprise";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Enterprise } from "@/types";
import { toast } from "sonner";

type Inputs = {
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type CadEmpresaAddressFormProps = {
  enterprise: Partial<Enterprise>;
  setEnterprise: Dispatch<SetStateAction<Partial<Enterprise> | null>>;
  setFormController: () => void;
};

export default function CadEmpresaAddressForm({
  enterprise,
  setEnterprise,
  setFormController,
}: Readonly<CadEmpresaAddressFormProps>) {
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const idOperation = useOperationStore((state) => state.idOperation);
  const registerWithMask = useHookFormMask(register);
  const { mutate } = useMutation({
    mutationFn: (data: Partial<Enterprise> & { adicional: any }) =>
      cadastrarEmpresa(data, idOperation),
    onSuccess: (data) => {
      console.log("success", data);
      setEnterprise({
        ...enterprise,
        idEmpresaOperacao: data?.idEmpresaOperacao,
      });
      toast.success("Empresa cadastrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.message || "Erro ao cadastrar empresa!");
    },
  });

  const onSubmit = (data: Inputs) => {
    console.log(data);
    const enterpriseData = data;
    console.log(enterpriseData);
    setEnterprise({ ...enterprise, adicional: JSON.stringify(enterpriseData) });
    mutate({ ...enterprise, adicional: enterpriseData as any });
  };

  useEffect(() => {
    if (enterprise.idEmpresaOperacao) {
      console.log(enterprise);
      setFormController();
    }
  }, [enterprise]);

  const values = watch();

  // verifica se pelo menos um campo foi preenchido
  const algumPreenchido = Object.values(values).some((v) => !!v && v !== "");

  const handleSearchCep = async (cep: string) => {
    axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((res) => {
      setValue("bairro", res.data.bairro);
      setValue("endereco", res.data.logradouro);
      setValue("cidade", res.data.localidade);
      setValue("estado", res.data.uf);
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
              {...registerWithMask("cep", ["99999-999"], {
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
            <Input id="endereco" type="text" {...register("endereco")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" type="text" {...register("bairro")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" type="text" {...register("cidade")} />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="estado">Estado</Label>
            <Input id="estado" type="text" {...register("estado")} />
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
