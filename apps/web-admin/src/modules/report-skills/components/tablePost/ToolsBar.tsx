import type { ISkillAdminDtoType } from "@skillsmatch/dto";
import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { reportskillRoute } from "../../router";

import { formatDateOnly } from "@/utils/formatDateTime";
import { DateRangePicker } from './../../../../../../../packages/ui/src/components/form/dateRange-Picker';

interface Props {
  table: Table<ISkillAdminDtoType>;
}
export default function ToolsBar({ table }: Props) {
  const [range, setRange] = useState<DateRange>();

  const nav = reportskillRoute.useNavigate();
  const search = reportskillRoute.useSearch();

  const localStatusOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Visible" },
    { value: "2", label: "Hidden" },
  ];

  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <>
          <InfiniteCombobox
            className="w-[200px] h-[37px]"
            placeholder="Select Status"
            name="Status"
            onChange={(event) => {
              nav({
                search: {
                  ...search,
                  statusVisibility: event,
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
