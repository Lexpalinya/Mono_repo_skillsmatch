import type { IBusinessModelAdminDtoType } from "@skillsmatch/dto";
import { DataTableToolbar } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";

interface Props {
  table: Table<IBusinessModelAdminDtoType>;
}
export default function ToolsBar({ table }: Props) {
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
