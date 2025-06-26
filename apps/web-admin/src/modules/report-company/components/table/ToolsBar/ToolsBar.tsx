import { reportCompanyRoute } from "@/modules/report-company/router";
import { businessModelComboboxService } from "@/service/combobox/business-model";
import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";
import { DateRangePicker } from "./../../../../../../../../packages/ui/src/components/form/dateRange-Picker";
import type { DateRange } from "react-day-picker";
import { formatDateOnly } from "@/utils/formatDateTime";
import { useState } from "react";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const [range, setRange] = useState<DateRange>();

  const nav = reportCompanyRoute.useNavigate();
  const search = reportCompanyRoute.useSearch();

  const localStatusOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Verified" },
    { value: "2", label: "Not Verified" },
  ];

  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <>
          <InfiniteCombobox
            className="w-[200px]  h-[37px]"
            name="Business"
            onChange={(event) => {
              nav({
                search: {
                  ...search,
                  bmIds: event,
                },
              });
            }}
            multiple={true}
            placeholder="Select Business Model"
            fetchItems={async ({ pageParam, search, limit = 10 }) =>
              businessModelComboboxService({ pageParam, search, limit })
            }
          />
          <InfiniteCombobox
            className="w-[200px] h-[37px]"
            placeholder="Select Status"
            name="Status"
            onChange={(event) => {
              nav({
                search: {
                  ...search,
                  status: event,
                },
              });
            }}
            fetchItems={async ({ pageParam = 1, search = "", limit = 10 }) => {
              const filtered = localStatusOptions.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              );

              const paginated = filtered.slice(
                (pageParam - 1) * limit,
                pageParam * limit
              );

              return {
                items: paginated,
                nextOffset:
                  pageParam * limit < filtered.length ? pageParam + 1 : null,
              };
            }}
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
