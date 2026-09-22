import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuccessCheckBlue from "@/components/SuccessCheckBlue";
import { Person } from "@/types";
import { Step, Stepper } from "react-form-stepper";
import CadPersonInfosForms from "./CadPersonInfosForms";
import BindPersonOperationForm from "./BindPersonOperationForm";
import CadPersonAddressForm from "./CadPersonAddressForm";

interface PersonFormProps {
  action: () => void;
}

export type PersonWithAdicional = Partial<Person> & { adicional: any };

export default function PersonForm({ action }: Readonly<PersonFormProps>) {
  const [formController, setFormController] = useState<any>({
    step: 0,
    totalStep: 3,
    description: "Dados internos",
  });

  const [person, setPerson] = useState<Partial<PersonWithAdicional> | null>(
    null
  );
  return (
    <div>
      {formController.step !== 3 && (
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
        <CadPersonInfosForms
          person={person}
          setFormController={() =>
            setFormController((prev:any) => ({
              ...prev,
              step: prev.step + 1,
              description: "Vínculo com a operação",
            }))
          }
          setPerson={setPerson}
        />
      )}

      {formController.step == 1 && (
        <BindPersonOperationForm
          person={person}
          setFormController={() =>
            setFormController((prev : any) => ({
              ...prev,
              step: prev.step + 1,
              description: "Endereços",
            }))
          }
          setPerson={setPerson}
        />
      )}

      {formController.step == 2 && (
        <CadPersonAddressForm
          person={person}
          setFormController={() =>
            setFormController((prev: any) => ({
              ...prev,
              step: prev.step + 1,
              description: "Finalizado",
            }))
          }
          setPerson={setPerson}
        />
      )}

      {formController.step == 3 && (
        <div className="flex justify-center items-center flex-col gap-3 text-center my-6">
          <SuccessCheckBlue />
          <h1 className="text-2xl font-semibold">
            Cadastro efetuado com <br />
            sucesso
          </h1>
          <Button
            className="w-full sm:max-w-40"
            variant="secondary"
            onClick={() => action()}
          >
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
}
