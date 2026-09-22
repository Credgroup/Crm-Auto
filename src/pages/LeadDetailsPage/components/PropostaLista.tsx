import { Input } from "@/components/ui/input";
import PropostaModal from "./PropostaModal";

function ProposalLista({
  title,
  proposals,
  searchable = false,
}: Readonly<{
  title: string;
  proposals: { id: string; name: string; status: string; date: string }[];
  searchable?: boolean;
}>) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {searchable && (
        <Input type="text" placeholder="Pesquisar" className="mb-4 w-72" />
      )}
      <div className="space-y-2">
        {proposals.map((proposal) => (
          <PropostaModal proposalObj={{}} key={proposal.id} {...proposal} />
        ))}
      </div>
    </div>
  );
}

export default ProposalLista;
