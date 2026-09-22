import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness } from "lucide-react";

function PropostaItem({
  id,
  name,
  status,
  date,
}: Readonly<{
  id: string;
  name: string;
  status: string;
  date: string;
}>) {
  return (
    <div className="flex w-full items-center justify-between p-4 bg-muted/70 rounded-md hover:bg-muted/90 hover:cursor-pointer">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-md bg-muted/100">
          <BriefcaseBusiness className="text-[var(--cor-principal)] dark:text-white" />
        </div>
        <div className="text-left">
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-500">{id}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Badge className="px-2 py-1 text-xs font-bold text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-full">
          {status}
        </Badge>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
    </div>
  );
}

export default PropostaItem;
