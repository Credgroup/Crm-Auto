import ContactCard from "@/pages/LeadDetailsPage/components/ContactCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { useState } from "react";


interface Email {
  idSeguradoI2k: number;
  idSegurado: number;
  idemail: number;
  email: string;
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
  emails?: Email[];
  isLoading?: boolean;
  onSelectChannel?: (channel: string, contact: Email | null) => void;
};

export default function EmailTab({
  emails = [],
  isLoading,
  onSelectChannel,
}: Readonly<Props>) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleSelect = (email: Email | null) => {
    if (email) {
      setSelectedEmail(String(email.idemail));
      onSelectChannel?.("email", email);
    } else {
      setSelectedEmail(null);
      onSelectChannel?.("email", null);
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
      {emails.length > 0 ? (
        <RadioGroup
          value={selectedEmail ?? ""}
          onValueChange={(value) => {
            const email = emails.find((e) => String(e.idemail) === value) || null;
            handleSelect(email);
          }}
          className="space-y-1"
        >
          {emails.map((item) => (
            <ContactCard
              key={String(item.idemail)}
              type="email"
              mode="radio"
              contato={item}
              valueId={String(item.idemail)}
              radioValue={selectedEmail ?? ""}
              onRadioChange={() => handleSelect(item)}
            />
          ))}
        </RadioGroup>
      ) : (
        <p>Sem endereços de e-mail</p>
      )}
    </div>
  );
}
