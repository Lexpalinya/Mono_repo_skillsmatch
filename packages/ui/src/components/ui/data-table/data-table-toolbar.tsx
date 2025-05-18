import React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "../input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDebounceCallback } from "../../hooks/use-debounce-callback";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  renderSlot?: (table: Table<TData>) => React.ReactNode;
  component?: React.ReactNode
  // onReset?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  renderSlot,
  component,
  // onReset,
}: DataTableToolbarProps<TData>) {
  // const isFiltered =
  //   table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  const debounced = useDebounceCallback(table.setGlobalFilter, 500);

  return (
    <div className="flex items-center justify-between ">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Search"
          defaultValue={table.getState().globalFilter}
          onChange={(event) => debounced(event.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2  w-full">{renderSlot?.(table)}</div>
        {/* {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.reset();
              onReset();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )} */}
      </div>
      <div className=" flex flex-warp gap-2">
        <DataTableViewOptions table={table} />
        {component}
      </div>
    </div>
  );
}
