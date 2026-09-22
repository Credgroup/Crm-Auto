import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Person } from "@/types";
import { useState } from "react";
import { Step, Stepper } from "react-form-stepper";
import { LuPencil } from "react-icons/lu";
import EditPersonInfosForms from "./EditPersonInfosForms";
import SuccessCheckBlue from "@/components/SuccessCheckBlue";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { editarPessoa } from "@/hooks/useCadPerson";

interface FormControllerTypes {
  step: number;
  totalStep: number;
  description: string;
}

type EditPersonInfoProps = {
  personDefault: Partial<Person | null>;
  refetchLeadData: () => void;
};

export default function EditPersonInfo({
  personDefault,
  refetchLeadData,
}: Readonly<EditPersonInfoProps>) {
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState<Partial<Person | null>>(personDefault);
  const [formController, setFormController] = useState<FormControllerTypes>({
    step: 0,
    totalStep: 2,
    description: "Dados internos",
  });

  const handleRefetchLeadDetails = () => {
    refetchLeadData();
  };

  const { mutate } = useMutation({
    mutationFn: (data: Partial<Person | null>) => editarPessoa(data),
    onSuccess: (data) => {
      console.log("success", data);
      toast.success(JSON.stringify(data));
      setFormController((prev) => ({
        ...prev,
        step: 1,
        description: "Dados internos",
      }));
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.message || "Erro ao cadastrar empresa!");
    },
  });

  function handleEditPersonInfos(data: Partial<Person | null>) {
    console.log(data);
    console.log("enviando....");
    mutate({ ...data, idSeguradoI2k: person?.idSeguradoI2k });
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setFormController({
            step: 0,
            totalStep: 2,
            description: "Dados internos",
          });
        } else {
          handleRefetchLeadDetails();
        }
      }}
      open={open}
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
          <DialogTitle>Editar informações</DialogTitle>
          <DialogDescription>
            Preencha os campos para editar os dados
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
          <EditPersonInfosForms
            person={person}
            setPerson={setPerson}
            setFormController={(data) => {
              console.log(data);
              handleEditPersonInfos(data);
            }}
          />
        )}

        {formController.step == 1 && (
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
