import { DataTableToolbar } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <div className="flex justify-between w-full">
          <div></div>
        </div>
      )}
    />
  );
}
