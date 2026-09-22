import { DataTable } from "@/components/DataTable/DataTable";
import { columnsDependentesTab } from "./columns";

export default function DependentesTable() {
   const tableData: {nome: string, idade: number, sexo: string}[] = []
    
  return (
    <div className="w-full h-full">
      <p className="text-sm text-gray-500">Em desenvolvimento</p>
      <DataTable
        columns={columnsDependentesTab}
        data={tableData}
        filter={["nome", "idade", "sexo"]}
        loading={false}
        error={false}
        pageCount={0}
        pageIndex={0}
        onPageChange={() => {}}
      />
    </div>
  );
}