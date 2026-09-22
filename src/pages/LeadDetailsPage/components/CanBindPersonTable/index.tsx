import { DataTable } from "@/components/DataTable/DataTable";
import { useState } from "react";
import useColumnsBindPerson from "./columns";
import { usePessoas } from "@/hooks/useCadPerson";
import { Person } from "@/types";

type CanBindPersonTableProps = {
  setSelectPerson: (data: Partial<Person>) => void;
};
export default function CanBindPersonTable({
  setSelectPerson,
}: Readonly<CanBindPersonTableProps>) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 4;
  const { data, isError, isFetching } = usePessoas({
    pageSize,
    pageIndex: pageIndex + 1,
    url: "api/crm/lead/find/available/operation"
  });

  const columns = useColumnsBindPerson({
    setSelectPerson: (data) => setSelectPerson(data),
  });

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      filter={["nome", "cpf", "idSeguradoI2k"]}
      error={isError}
      loading={isFetching}
    />
  );
}
