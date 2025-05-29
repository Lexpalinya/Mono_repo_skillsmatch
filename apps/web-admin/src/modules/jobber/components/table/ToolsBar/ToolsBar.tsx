import {
  DataTableToolbar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";

interface Props<T> {
  table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const renderFilterSelect = (
    columnId: string,
    placeholder: string,
    options: { value: string; label: string }[]
  ) => (
    <Select
      value={table.getColumn(columnId)?.getFilterValue() as string}
      onValueChange={(event) =>
        table.getColumn(columnId)?.setFilterValue(event)
      }
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <div className="flex justify-between w-full">
          {renderFilterSelect("role", "Select a Role", [
            { value: "all", label: "All Role" },
            { value: "admin", label: "Admin" },
            { value: "jobber", label: "Jobber" },
            { value: "company", label: "Company" },
          ])}
        </div>
      )}
    />
  );
}
