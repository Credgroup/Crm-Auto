import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOperationStore } from "@/store/operationStore";
import { useHookFormMask } from "use-mask-input";
import { Dispatch, SetStateAction } from "react";
import { Enterprise } from "@/types";

type Inputs = {
  idExterno: string;
  nrTelefone: string;
  endereco: string;
  cdStatus: string;
  nrDDD: string;
  dsEmail: string;
};

type EditEnterpriseOperationFormProps = {
  enterprise: Partial<Enterprise | null>;
  setFormController: (data?: Partial<Enterprise | null>) => void;
  setEnterprise: Dispatch<SetStateAction<Partial<Enterprise | null>>>;
};

export default function EditEnterpriseOperationForm({
  setFormController,
  enterprise,
}: Readonly<EditEnterpriseOperationFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      idExterno: enterprise?.idExterno,
      nrTelefone: enterprise?.nrTelefone,
      nrDDD: enterprise?.nrDDD,
      dsEmail: enterprise?.dsEmail,
    },
  });
  const idOperationSelected = useOperationStore((state) => state.idOperation);
  const registerWithMask = useHookFormMask(register);

  const onSubmit = (data: Inputs) => {
    if (!idOperationSelected) {
      toast.error("Selecione uma operação");
      return;
    }
    const enterpriseData: Partial<Enterprise> = {
      idExterno: data.idExterno,
      nrTelefone: data.nrTelefone,
      nrDDD: data.nrDDD,
      dsEmail: data.dsEmail,
    };

    setFormController({ ...enterpriseData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex justify-between gap-2 w-full flex-wrap">
          <div className="w-full md:w-[49%]">
            <Label htmlFor="idExterno">Id Externo</Label>
            <Input
              id="idExterno"
              type="text"
              disabled
              {...register("idExterno", { required: true })}
            />
            {errors.idExterno && (
              <span className="text-rose-400">Este campo é obrigatório</span>
            )}
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="nrDDD">DDD</Label>
            <Input
              id="nrDDD"
              type="text"
              {...registerWithMask("nrDDD", ["(99)"], {
                autoUnmask: true,
              })}
            />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="nrTelefone">Número de telefone</Label>
            <Input
              id="nrTelefone"
              type="text"
              {...registerWithMask("nrTelefone", ["99999-9999"], {
                autoUnmask: true,
              })}
            />
          </div>

          <div className="w-full md:w-[49%]">
            <Label htmlFor="dsEmail">Email</Label>
            <Input id="dsEmail" type="text" {...register("dsEmail")} />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mt-4 gap-4">
        <Button
          className="bg-[#002c77] hover:bg-blue-950 text-white w-full md:max-w-36"
          disabled={!isValid}
          type="submit"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}
