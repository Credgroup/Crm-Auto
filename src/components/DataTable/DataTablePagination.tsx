import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  serverSide?: boolean;
  onPageChange?: (pageIndex: number) => void;
  pageIndex?: number;
  pageCount?: number;
}

export function DataTablePagination<TData>({
  table,
  serverSide = false,
  onPageChange,
  pageIndex,
  pageCount,
}: Readonly<DataTablePaginationProps<TData>>) {
  const actualPageIndex = serverSide
    ? pageIndex ?? 0
    : table.getState().pagination.pageIndex;
  const actualPageCount = serverSide ? pageCount ?? 1 : table.getPageCount();

  const canPreviousPage = serverSide
    ? actualPageIndex > 0
    : table.getCanPreviousPage();
  const canNextPage = serverSide
    ? actualPageIndex < actualPageCount - 1
    : table.getCanNextPage();

  const setPageServerSide = (index: number) => {
    if (onPageChange) {
      onPageChange(index);
    }
  };

  const setPageClientSide = (index: number) => {
    table.setPageIndex(index);
  };

  useEffect(() => {
    console.log(table.getPageCount());
    console.log(pageCount);
  }, [actualPageCount, pageCount]);

  const setPage = serverSide ? setPageServerSide : setPageClientSide;

  return (
    <div className={cn("flex items-center pt-2", !serverSide ? "justify-between" : "justify-end")}>
      {
        !serverSide && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada.
          </div>
        )
      }
      <div className="flex items-center space-x-6 lg:space-x-8">
        {!serverSide && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Linhas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(actualPageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft />
          </Button>
          <div className="flex w-fit items-center justify-center text-sm font-medium px-2">
            {actualPageIndex + 1} de {actualPageCount}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(actualPageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(actualPageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
