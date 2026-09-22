import ContactCard from "@/pages/LeadDetailsPage/components/ContactCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { useState } from "react";

interface Phone {
  idSeguradoI2k: number;
  idSegurado: number;
  idContato: number;
  nrDDD: number;
  nrTelefone: number;
  tpTelefone: number;
  chTelefone: number;
  tpPrincipal: number;
  chPrincipal: number;
  principal: boolean;
  tpScore: number;
  chScore: number;
  score: string;
  cdStatus: number;
  chStatus: number;
  status: string;
  blacklist: string;
  chblacklist: number;
  tpBlacklist: number;
}

type Props = {
  phones?: Phone[];
  isLoading?: boolean;
  onSelectChannel?: (channel: string, contact: Phone | null) => void;
};

export default function PhoneTab({
  phones = [],
  isLoading,
  onSelectChannel,
}: Readonly<Props>) {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const handleSelect = (phone: Phone | null) => {
    if (phone) {
      setSelectedPhone(String(phone.idContato));
      onSelectChannel?.("phone", phone);
    } else {
      setSelectedPhone(null);
      onSelectChannel?.("phone", null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-5">
      {phones.length > 0 ? (
        <RadioGroup
          value={selectedPhone ?? ""}
          onValueChange={(value) => {
            const phone = phones.find((p) => String(p.idContato) === value) || null;
            handleSelect(phone);
          }}
          className="space-y-1"
        >
          {phones.map((item) => (
            <ContactCard
              key={String(item.idContato)}
              type="phone"
              mode="radio"
              contato={item}
              valueId={String(item.idContato)}
              radioValue={selectedPhone ?? ""}
              onRadioChange={() => handleSelect(item)}
            />
          ))}
        </RadioGroup>
      ) : (
        <p>Sem números de telefone</p>
      )}
    </div>
  );
}
