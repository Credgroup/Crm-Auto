import { Proposal } from "@/types";
import AgroupedProposalsDetailsTab from "./AgroupedProposalsDetailsTab";
import SingleProposalTab from "./SingleProposalTab";
import ShottingDetailsTab from "./ShottingDetailsTab";
import AccountPlacementProposalTab from "./AccountPlacementTab";

type AgroupedProposalsProps = {
  currentTab: any;
  agroupedProposal: Partial<Proposal>;
};

export default function AgroupedProposals({
  currentTab,
  agroupedProposal,
}: Readonly<AgroupedProposalsProps>) {
  return (
    <>
      {currentTab?.active && currentTab.id == 1 && (
        <SingleProposalTab id={agroupedProposal.idGrupoProposta ?? ""} />
      )}
      {currentTab?.active && currentTab.id == 2 && (
        <AgroupedProposalsDetailsTab details={agroupedProposal} />
      )}
      {currentTab?.active && currentTab.id == 3 && <ShottingDetailsTab />}
      {currentTab?.active && currentTab.id == 4 && <AccountPlacementProposalTab idProposalGroup={agroupedProposal.idGrupoProposta} />}
    </>
  );
}
