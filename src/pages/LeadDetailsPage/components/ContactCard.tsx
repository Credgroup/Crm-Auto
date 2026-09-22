import { FaPhoneAlt, FaStar } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import CriarEditarContatoModal from "./CriarEditarContatoModal";
import { formatValue } from "@/lib/utils";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface ContactCardProps {
  contato: any;
  type: "phone" | "email";
  mode?: "edit" | "radio";
  radioValue?: string;
  onRadioChange?: (value: string) => void;
  valueId: string;
}

export default function ContactCard({
  contato,
  type,
  mode = "edit",
  radioValue,
  onRadioChange,
  valueId,
}: Readonly<ContactCardProps>) {
  const isSelected = radioValue === valueId;

  return (
    <div
      className={`flex flex-row items-center space-x-4 rounded-lg p-3 bg-muted/70 hover:bg-muted/90 cursor-pointer transition
        ${mode === "radio" && isSelected ? "ring-2 ring-[var(--cor-principal)]" : ""}
      `}
      role="button"
      tabIndex={0}
      onClick={() => onRadioChange?.(valueId)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onRadioChange?.(valueId);
      }}
    >

      {/* Radio fixo no canto esquerdo */}
      {mode === "radio" && (
        <div
          onClick={(e) => e.stopPropagation()} // impede clique direto no radio interferir no restante
          className="flex items-center"
        >
          <RadioGroup.Item
            value={valueId}
            checked={isSelected}
            className="h-4 w-4 rounded-full border-2 border-gray-400 flex items-center justify-center"
          >
            <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-[var(--cor-principal)]" />
          </RadioGroup.Item>
        </div>
      )}

      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted/100 text-[var(--cor-principal)] dark:text-white">
        {type === "phone" && <FaPhoneAlt />}
        {type === "email" && <MdAlternateEmail />}
      </div>

      <div className="flex-1">
        {type === "phone" && (
          <p className="text-sm font-medium text-wrap">
            {contato.nrTelefone.toString().length > 8 &&
              formatValue(
                "celular",
                contato.nrDDD.toString() + contato.nrTelefone.toString()
              )}

            {contato.nrTelefone.toString().length === 8 &&
              formatValue(
                "fixo",
                contato.nrDDD.toString() + contato.nrTelefone.toString()
              )}
          </p>
        )}

        {type === "email" && (
          <p className="text-sm font-medium text-wrap">{contato.email}</p>
        )}
      </div>

      {/* Tag principal */}
      {contato.principal && (
        <div className="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
          PRINCIPAL
        </div>
      )}

      {/* Telefone extra */}
      {type === "phone" && (
        <span className="text-sm font-medium">{contato.telefone}</span>
      )}

      {/* Score */}
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{contato.score}</span>
        <FaStar className="text-yellow-400 w-4" />
      </div>

      {/* Botão de edição */}
      {mode === "edit" && (
        <div
          className="flex items-center"
          onClick={(e) => e.stopPropagation()} // evita selecionar o cartão ao clicar no modal
        >
          <CriarEditarContatoModal />
        </div>
      )}
    </div>
  );
}
