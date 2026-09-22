import { DataTable } from "@/components/DataTable/DataTable";
import { useState } from "react";
import { columnsPerson } from "../ColumnsLead";
import { usePessoas } from "@/hooks/useCadPerson";

export default function PersonTable() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 6;
  const [filters, setFilters] = useState({
    tpFilter: "",
    filterValue: "",
  })
  const [search, setSearch] = useState({
    tpFilter: "",
    filterValue: "",
  })
  const { data, isError, isFetching, isRefetching, isLoading } = usePessoas({
    pageSize,
    pageIndex: pageIndex + 1,
    search
  });

  return (
    <DataTable
      columns={columnsPerson}
      data={data?.items ?? []}
      pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      filter={["nome", "cpf", "idSeguradoI2k"]}
      error={isError}
      loading={isFetching ?? isRefetching ?? isLoading}
      
      tpFilterList={["idSegurado", "nmSegurado", "nmSocial", "nrCPF"]}
      onTpFilterSearch={setSearch}
      tpFilterSelected={filters.tpFilter}
      filterValue={filters.filterValue}
      setTpFilterSelected={(tpFilter: string) =>
        setFilters({ ...filters, tpFilter })
      }
      setFilterValue={(filterValue: string) =>
        setFilters({ ...filters, filterValue })
      }
    />
  );
}
