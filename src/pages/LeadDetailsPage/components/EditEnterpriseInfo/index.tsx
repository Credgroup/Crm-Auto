import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogTitle } from "@radix-ui/react-dialog";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";
import { Enterprise } from "@/types";
import { Step, Stepper } from "react-form-stepper";
import EditEnterpriseOperationForm from "./EditEnterpriseOperationForm";
import EditEmpresaAddressForm from "./EditEmpresaAddressForm";
import SuccessCheckBlue from "@/components/SuccessCheckBlue";

interface FormControllerTypes {
  step: number;
  totalStep: number;
  description: string;
}

type EditEnterpriseInfoProps = {
  enterpriseDefault: Enterprise;
  refetchLeadData: () => void;
};

export default function EditEnterpriseInfo({
  enterpriseDefault,
  refetchLeadData,
}: Readonly<EditEnterpriseInfoProps>) {
  const [open, setOpen] = useState(false);
  const [enterprise, setEnterprise] =
    useState<Partial<Enterprise | null>>(enterpriseDefault);
  const [editEnterprise, seteditEnterprise] = useState<
    Partial<Enterprise | null>
  >({ idEmpresaOperacao: enterpriseDefault.idEmpresaOperacao });
  const [formController, setFormController] = useState<FormControllerTypes>({
    step: 0,
    totalStep: 3,
    description: "Dados internos",
  });

  const handleRefetchLeadDetails = () => {
    refetchLeadData();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setFormController({
            step: 0,
            totalStep: 3,
            description: "Dados internos",
          });
        } else {
          handleRefetchLeadDetails();
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="aspect-square w-8 h-8"
            >
              <LuPencil />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar Informações</TooltipContent>
      </Tooltip>

      <DialogContent
        className="w-[60vw] max-w-6xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editar Informações</DialogTitle>
          <DialogDescription>
            Edite as informações necessárias e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        {formController.step != formController.totalStep - 1 && (
          <Stepper
            activeStep={formController?.step}
            connectorStateColors={true}
            className="p-0 m-0"
            styleConfig={{
              activeBgColor: "#002c77",
              activeTextColor: "#fff",
              inactiveBgColor: "#fff",
              inactiveTextColor: "#002c77",
              completedBgColor: "#002c77",
              completedTextColor: "#fff",
              size: "1.6em",
              circleFontSize: "1rem",
              labelFontSize: "0.875rem",
              borderRadius: "50%",
              fontWeight: "500",
            }}
            connectorStyleConfig={{
              activeColor: "#002c77",
              completedColor: "#002c77",
              disabledColor: "#bdbdbd",
              size: 2,
              style: "solid",
            }}
          >
            {Array.from({ length: formController.totalStep }, (_, index) => (
              <Step key={index} />
            ))}
          </Stepper>
        )}
        {formController.step == 0 && (
          <EditEnterpriseOperationForm
            enterprise={enterprise}
            setEnterprise={setEnterprise}
            setFormController={(data) => {
              console.log(data);
              seteditEnterprise((prev) => ({ ...prev, ...data }));
              setFormController((prev) => ({
                ...prev,
                step: 1,
                description: "Dados internos",
              }));
            }}
          />
        )}
        {formController.step == 1 && (
          <EditEmpresaAddressForm
            enterprise={enterprise}
            editEnterprise={editEnterprise}
            setEnterprise={setEnterprise}
            setFormController={() => {
              setFormController((prev) => ({
                ...prev,
                step: 2,
                description: "Finalizar",
              }));
            }}
          />
        )}
        {formController.step == 2 && (
          <div className="flex justify-center items-center flex-col gap-3 text-center my-6">
            <SuccessCheckBlue />
            <div className="mb-4 space-y-2 w-full max-w-[400px]">
              <h1 className="text-2xl font-semibold">
                Edição de informações concluída
              </h1>
            </div>
            <div className="flex flex-col-reverse justify-center md:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  handleRefetchLeadDetails();
                  setOpen(false);
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
