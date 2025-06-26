import { reportmemberRoute } from "@/modules/report-member/router";
import { formatDateOnly } from "@/utils/formatDateTime";
import {
  DataTableToolbar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "./../../../../../../../../packages/ui/src/components/form/dateRange-Picker";

interface Props<T> {
  table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const [range, setRange] = useState<DateRange>();

  const nav = reportmemberRoute.useNavigate();
  const search = reportmemberRoute.useSearch();

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
        <>
          <div className="flex w-full">
            {renderFilterSelect("role", "Select a Role", [
              { value: "all", label: "All Role" },
              { value: "admin", label: "Admin" },
              { value: "jobber", label: "Jobber" },
              { value: "company", label: "Company" },
            ])}

            <DateRangePicker
              value={range}
              onChange={(newRange) => {
                setRange(newRange);

                const hasFullRange = newRange?.from && newRange?.to;

                if (!hasFullRange) {
                  const { startDate, endDate, ...rest } = search;
                  nav({ search: { ...rest } });
                }
              }}
              onConfirm={(confirmedRange) => {
                if (confirmedRange?.from && confirmedRange?.to) {
                  nav({
                    search: {
                      ...search,
                      startDate: formatDateOnly(confirmedRange.from),
                      endDate: formatDateOnly(confirmedRange.to),
                    },
                  });
                }
              }}
              placeholder="Pick a date range"
              className="ml-[10px] w-[400px] h-[37px]"
            />
          </div>
        </>
      )}
    />
  );
}
