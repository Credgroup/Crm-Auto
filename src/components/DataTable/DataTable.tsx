import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useState } from "react";
import { Input } from "../ui/input";
import { DataTablePagination } from "./DataTablePagination";
import { v4 as uuidv4 } from "uuid";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "../ui/select";
import { Button } from "../ui/button";
import { LuSearch } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LucideMoreHorizontal } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: string[];
  pageCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageIndex?: number;
  pageSize?: number;
  loading?: boolean;
  error?: boolean;
  tpFilterList?: string[];
  onTpFilterSearch?: (filters: {tpFilter: string, filterValue: string}) => void;
  tpFilterSelected?: string;
  filterValue?: string;
  setTpFilterSelected?: (tpFilter: string) => void;
  setFilterValue?: (filterValue: string) => void;
  className?: string;
  dataTableOptions?: ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  pageCount,
  onPageChange,
  pageIndex = 0,
  loading,
  onPageSizeChange,
  error,
  pageSize = 10,
  tpFilterList = [],
  onTpFilterSearch,
  tpFilterSelected,
  filterValue,
  setTpFilterSelected,
  setFilterValue,
  className,
  dataTableOptions
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );

  const paginationState =
    pageCount !== undefined
      ? { pageIndex: pageIndex, pageSize: pageSize }
      : undefined;

  const table = useReactTable<TData>({
    data,
    columns,
    manualPagination: pageCount !== undefined,
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    globalFilterFn: (row, _columnId, filterValue: string) => {
      const fieldsToSearch = filter || [];

      return fieldsToSearch.some((field) => {
        const original = row.original as Record<string, any>;
        const value = original[field];
        return String(value ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    },

    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: paginationState ?? {
        pageIndex: 0,
        pageSize: 10,
      },
    },

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({
              pageIndex: pageIndex ?? 0,
              pageSize: pageSize ?? 10,
            })
          : updater;

      onPageChange?.(newPagination.pageIndex);
      onPageSizeChange?.(newPagination.pageSize);
    },
  });

  return (
    <div className={cn("relative rounded-md border p-4 bg-muted/25 flex flex-col justify-between w-full", className)}>
      
      {dataTableOptions && (
        <div className="absolute z-50 top-3 right-4 flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="w-7 h-7">
                <LucideMoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 max-w-[200px]">
              {dataTableOptions}
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div>
        {
          tpFilterList.length > 0 && tpFilterList.filter(item => item !== "").length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={tpFilterSelected} onValueChange={setTpFilterSelected}>
                <SelectTrigger className="min-w-[100px] max-w-fit gap-3">
                  <SelectValue placeholder="Selecione um filtro"/>
                </SelectTrigger>
                <SelectContent>
                  {tpFilterList.filter(item => item !== "").map((item, index) => (
                    <SelectItem key={`${item}-${index}`} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                value={filterValue}
                onChange={(e) => setFilterValue?.(e.target.value)}
                placeholder="Pesquisar"
                className="max-w-[240px]"
              />
              <Button onClick={() => onTpFilterSearch?.({tpFilter: tpFilterSelected ?? "", filterValue: filterValue ?? ""})} size="icon" className="aspect-square">
                <LuSearch />
              </Button>
            </div>
          )
        }
        <Table>
          {
            table.getHeaderGroups()[0].headers.length > 0 && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            )
          }
          <TableBody className="h-full">
            {loading &&
              Array.from({ length: 5 }).map(() => (
                <TableRow key={`skeleton-row-${uuidv4()}`}>
                  {table.getVisibleFlatColumns().map(() => (
                    <TableCell key={`skeleton-cell-${uuidv4()}`}>
                      <div className="h-6 rounded bg-muted animate-pulse w-full"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!!table.getRowModel().rows?.length &&
              !loading &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {error && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Não foi possível carregar os dados.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              table.getRowModel().rows?.length !== undefined &&
              table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        serverSide={pageCount !== undefined}
        onPageChange={onPageChange}
        pageIndex={pageIndex}
        pageCount={pageCount}
      />
    </div>
  );
}
