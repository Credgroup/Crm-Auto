import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Proposal } from "@/types";
import { ReactNode } from "react";
import { LuEllipsisVertical, LuSendHorizontal } from "react-icons/lu";
import DialogSentedProposals from "../DialogSentedProposals";
import { EnviarPropostaMenu } from "@/components/EnviarPropostaMenu";

type UserInterestProductItemProps = {
  id: number;
  icon: ReactNode;
  name: string;
  proposals?: Partial<Proposal>[];
  action: () => void;
  userType?: "enterprise" | "person";
  idEmpresaOperacao?: string | null;
};

export default function UserInterestProductItem({
  icon,
  name,
  id,
  action,
  userType,
  idEmpresaOperacao,
}: Readonly<UserInterestProductItemProps>) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/70 hover:bg-muted/90 rounded-md">
      <div className="flex justify-between items-center w-full gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md dark:bg-muted/90 bg-zinc-200 aspect-square">
          {icon}
        </div>
        <span className="text-xl font-bold w-full">{name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 aspect-square"
              onClick={action}
            >
              <LuEllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-1">
            <DialogSentedProposals />

            {userType == "enterprise" && (
              <EnviarPropostaMenu
                cliData={{
                  idEmpresaOperacao: idEmpresaOperacao ?? "",
                }}
                ButtonTrigger={
                  <Button
                    variant="ghost"
                    className="justify-start w-full px-2 h-8 font-normal rounded-sm"
                  >
                    <LuSendHorizontal /> Enviar Proposta
                  </Button>
                }
                selectedProduct={{
                  idProduto: id,
                  nmProduto: name,
                }}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
