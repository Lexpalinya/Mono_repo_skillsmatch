import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";
import { companyComboboxService } from "../../../../../service/combobox/company";
import { reportpostRoute } from "@/modules/report-post/router";
import { DateRangePicker } from "./../../../../../../../../packages/ui/src/components/form/dateRange-Picker";
import { formatDateOnly } from "@/utils/formatDateTime";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const [range, setRange] = useState<DateRange>();
  
  const nav = reportpostRoute.useNavigate();
  const search = reportpostRoute.useSearch();
  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <>
          <InfiniteCombobox
            className="w-[200px]"
            onChange={(event) => {
              nav({
                search: {
                  ...search,
                  cIds: event,
                },
              });
            }}
            multiple={true}
            placeholder="Select Company"
            fetchItems={async ({ pageParam, search, limit = 10 }) =>
              companyComboboxService({ pageParam, search, limit })
            }
          />
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
            className="w-[400px] h-[37px]"
          />
        </>
      )}
    />
  );
}
