import { Proposal } from "@/types";
import GeneralStatus from "./GeneralStatus";
import ProposalAnswers from "./ProposalAnswers";
import { useEffect } from "react";
import ProposalDocuments from "./ProposalDocuments";
import ProposalHistoricTab from "./ProposalHistoric";
import ProposalQuotesTab from "./ProposalQuotesTab";

type SingleProposalProps = {
  proposal: Partial<Proposal>;
  currentTab: any;
};
export default function SingleProposal({
  proposal,
  currentTab,
}: Readonly<SingleProposalProps>) {
  useEffect(() => {
    console.log(proposal);
    console.log(proposal.idProposta);
  });
  return (
    <>
      {currentTab?.active && currentTab.id == 1 && (
        <GeneralStatus details={proposal} />
      )}
      {currentTab?.active && currentTab.id == 2 && (
        <ProposalAnswers id={proposal.idProposta ?? ""} proposal={proposal} />
      )}
      {currentTab?.active && currentTab.id == 3 && <ProposalQuotesTab proposal={proposal} />}
      {currentTab?.active && currentTab.id == 4 && <ProposalDocuments proposal={proposal} id={proposal.idProposta} />}
      {
        currentTab.active && currentTab.id == 5 && <ProposalHistoricTab proposal={proposal} id={proposal.idProposta} />
      }
    </>
  );
}
