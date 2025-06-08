import { postRoute } from "@/modules/post/router";
import { DataTableToolbar, InfiniteCombobox } from "@skillsmatch/ui";
import type { Table } from "@tanstack/react-table";
import { companyComboboxService } from "../../../../../service/combobox/company";

interface Props<T> {
  readonly table: Table<T>;
}

export default function ToolsBar<T>({ table }: Props<T>) {
  const nav = postRoute.useNavigate();
  const search = postRoute.useSearch();
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
      )}
    />
  );
}
