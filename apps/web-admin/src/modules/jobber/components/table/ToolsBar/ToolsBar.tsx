import { jobberStatusComboboxService } from "@/modules/service/combobox/jobber-status";
import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <InfiniteCombobox
          className="w-[200px]"
          onChange={(event) => table.getColumn("status")?.setFilterValue(event)}
          placeholder="Select Status"
          fetchItems={async ({ pageParam, search, limit = 10 }) =>
            jobberStatusComboboxService({ pageParam, search, limit })
          }
        />
      )}
    />
  );
}
