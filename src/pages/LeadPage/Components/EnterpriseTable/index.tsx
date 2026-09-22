import { DataTable } from "@/components/DataTable/DataTable";
import { useEmpresas } from "@/hooks/useCadEnterprise";
import { useState } from "react";
import { columnsEnterprise } from "../ColumnsLead";

export default function EnterpriseTable() {
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
  
  const { data, isError, isFetching, isRefetching, isLoading } = useEmpresas(
    pageIndex + 1,
    pageSize,
    search
  );


  return (
    <DataTable
      columns={columnsEnterprise}
      data={data?.items ?? []}
      pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      tpFilterList={["nmFantasia", "idEmpresa", "nrCNPJ"]}
      onTpFilterSearch={setSearch}
      tpFilterSelected={filters.tpFilter}
      filterValue={filters.filterValue}
      setTpFilterSelected={(tpFilter: string) =>
        setFilters({ ...filters, tpFilter })
      }
      setFilterValue={(filterValue: string) =>
        setFilters({ ...filters, filterValue })
      }
      error={isError}
      loading={isFetching ?? isRefetching ?? isLoading}
    />
  );
}
