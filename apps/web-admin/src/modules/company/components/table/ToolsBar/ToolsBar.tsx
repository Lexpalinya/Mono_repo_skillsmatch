import { companyRoute } from "@/modules/company/router";
import { businessModelComboboxService } from "@/service/combobox/business-model";
import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const nav = companyRoute.useNavigate();
  const search = companyRoute.useSearch();
  return (
    <DataTableToolbar
      table={table}
      renderSlot={() => (
        <InfiniteCombobox
          className="w-[200px]"
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
      )}
    />
  );
}
