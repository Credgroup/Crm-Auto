import ButtonGroupTableLead from "./Components/ButtonGroupTableLead";
import EnterpriseTable from "./Components/EnterpriseTable";
import { useState } from "react";
import NovoLeadModal from "./Components/NovoLeadModal";
import PersonTable from "./Components/PersonTable";

export type SelectedTableType = "empresa" | "pessoa";
function LeadPage() {
  const [selectedTable, setSelectedTable] = useState<SelectedTableType>("empresa");
  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <NovoLeadModal />
        <ButtonGroupTableLead
          dispatch={(value: SelectedTableType) => setSelectedTable(value)}
        />
      </div>
      <div className="w-full flex-1 pb-6">
        {selectedTable == "empresa" && <EnterpriseTable />}
        {selectedTable == "pessoa" && <PersonTable />}
      </div>
    </div>
  );
}

export default LeadPage;
