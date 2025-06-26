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
        </>
      )}
    />
  );
}
