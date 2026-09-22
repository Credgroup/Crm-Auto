import SingleProposalTable from "../../SingleProposalTable";

type SingleProposalTabProps = {
  id: string;
};
export default function SingleProposalTab({
  id,
}: Readonly<SingleProposalTabProps>) {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Propostas Vinculadas</h1>
      <SingleProposalTable id={id} />
    </>
  );
}
