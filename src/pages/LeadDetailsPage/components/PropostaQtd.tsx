import { Send } from "lucide-react";

type PropostaQtdProps = {
  sent: number;
  responded: number;
  cliData?: any;
  type?: string;
};

function PropostaQtd({ sent }: Readonly<PropostaQtdProps>) {
  return (
    <div className="flex flex-col gap-y-4 items-end">
      <div className="flex flex-row gap-4 w-full">
        <div className="w-full flex items-center justify-between p-4 rounded-md border">
          <div className="flex items-center space-x-2">
            <div className="bg-muted/75 rounded-md p-2">
              <Send className="text-[var(--cor-principal)] dark:text-white" />
            </div>
            <span>Propostas enviadas</span>
          </div>
          <span className="text-xl font-bold">{sent}</span>
        </div>
      </div>
    </div>
  );
}

export default PropostaQtd;
