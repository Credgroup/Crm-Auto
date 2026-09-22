import { EnviarPropostaMenu } from "@/components/EnviarPropostaMenu";
import AgroupProposalTable from "./AgroupProposalTable";
import { useState } from "react";

type PropostaTabProps = {
  cliData?: any;
  type?: string;
};
export default function PropostaTab({ cliData }: Readonly<PropostaTabProps>) {
  const [refetchData, setRefetchData] = useState(false);
  return (
    <div className="space-y-4 flex flex-col justify-center items-end">
      <EnviarPropostaMenu cliData={cliData} onClose={()=> {setRefetchData((state) => !state)}} />
      <div className="w-full">
        <AgroupProposalTable id={cliData.idEmpresaOperacao} needRefetch={refetchData}/>
      </div>
    </div>
  );
}
