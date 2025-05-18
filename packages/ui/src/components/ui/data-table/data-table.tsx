import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
  Table as ReactTableInstance,
  RowData,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  TableState,
  OnChangeFn,
  ColumnOrderState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { DataTablePagination } from "./data-table-pagination";
import { Spinner } from "../spinner";
import { motion, AnimatePresence, MotionProps } from "motion/react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  rowCount: number;
  renderToolbar?: (table: ReactTableInstance<TData>) => React.ReactNode;
  rowSelection: Record<number, boolean>;
  onRowSelectionChange?: (
    selectedRows: TData[],
    selectionState: Record<number, boolean>
  ) => void;

  isLoading?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
  error?: unknown;

  state: Partial<TableState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  onGlobalFilterChange?: OnChangeFn<any>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
}

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const MotionTableRow = motion(TableRow);
const MotionTableBody = motion(TableBody);
const MotionTableContainer = motion.div;

export function DataTable<TData>({
  columns,
  data,
  rowCount,
  renderToolbar,
  rowSelection,
  onRowSelectionChange,

  error,
  isFetching,
  isPending,
  isLoading,

  state,
  onColumnFiltersChange,
  onColumnOrderChange,
  onGlobalFilterChange,
  onPaginationChange,
  onSortingChange,
}: DataTableProps<TData>) {
  // const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [prevData, setPrevData] = useState<TData[]>(data);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    if (JSON.stringify(prevData) !== JSON.stringify(data)) {
      setIsDataChanged(true);
      setPrevData(data);
      const timer = setTimeout(() => {
        setIsDataChanged(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data, prevData]);

  const table = useReactTable({
    data,
    rowCount,
    columns,
    state: { ...state, columnVisibility, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(rowSelection) : updater;

      const selectedRows =
        Object.keys(newState).length === 0
          ? []
          : data.filter((_, index) => newState[index]);

      onRowSelectionChange?.(selectedRows, newState);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange,
    onColumnOrderChange,
    onGlobalFilterChange,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    initialState: {
      columnFilters: [],
      columnOrder: [],
      columnVisibility: {},
      globalFilter: "",
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
    },
  });

  return (
    <div className="space-y-4 mt-[10px]">
      {renderToolbar?.(table)}
      <MotionTableContainer
        className="rounded-md border relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={tableContainerVariants}
      >
        {isLoading || isPending ? (
          <motion.div
            className="flex h-48 items-center justify-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner size="medium" /> Loading...
          </motion.div>
        ) : error ? (
          <motion.div
            className="flex h-48 items-center justify-center text-destructive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(error as Error).message || "Something went wrong."}
          </motion.div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="group/row">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <AnimatePresence>
              <MotionTableBody
                initial={false}
                animate={isDataChanged ? { opacity: 1 } : {}}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <MotionTableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group/row"
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tableRowVariants}
                      layout
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.columnDef.meta?.className ?? ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </MotionTableRow>
                  ))
                ) : (
                  <MotionTableRow
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </MotionTableRow>
                )}
              </MotionTableBody>
            </AnimatePresence>
          </Table>
        )}

        {isFetching && !isLoading && (
          <motion.div
            className="absolute right-2 top-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { repeat: Infinity, duration: 1.5 },
            }}
          >
            Refreshing...
          </motion.div>
        )}
      </MotionTableContainer>
      <DataTablePagination table={table as ReactTableInstance<unknown>} />
    </div>
  );
}
