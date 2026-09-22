
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReactNode } from "react";
import { LuExpand } from "react-icons/lu";

import Table from "./Table";

interface CockpitExpandedDialogProps {
  children: ReactNode;
  dataInicio?: string;
  dataFim?: string;
  idsOperacoes?: string[];
  endpointUrl: string;
}

export default function CockpitExpandedDialog({
  children, 
  dataInicio, 
  dataFim, 
  idsOperacoes,
  endpointUrl
}: Readonly<CockpitExpandedDialogProps>){
    return (
        <Dialog>
            <DialogTrigger className="group relative flex justify-start items-start text-start w-full">
                {children}
                <div className="absolute right-3 bottom-3 group-hover:opacity-100 opacity-0 border-white transition-all">
                    <LuExpand className="text-muted-foreground/50 hover:scale-125 transition-transform"/>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Analítico Total Propostas</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Table 
                  dataInicio={dataInicio}
                  dataFim={dataFim}
                  idsOperacoes={idsOperacoes}
                  endpointUrl={endpointUrl}
                />
            </DialogContent>
        </Dialog>
    )
}