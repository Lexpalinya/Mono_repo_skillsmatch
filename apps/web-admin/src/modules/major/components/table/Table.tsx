import { MajorColumn } from "./Column";
import { useMajor } from "../../context/useMajor";
import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar";

export const MajorTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useMajor();

  return (
    <DataTable
      columns={MajorColumn}
      renderToolbar={(table) => <ToolsBar table={table} />}
      data={data?.data ?? []}
      rowCount={data?.total}
      isLoading={isLoading}
      isPending={isPending}
      isFetching={isFetching}
      error={error}
      {...stateAndOnChanges}
      rowSelection={rowSelection}
      onRowSelectionChange={(rows, newSelection) => {
        setRowSelection(newSelection);
        setSelectedIds(rows.map((r) => r.id));
      }}
    />
  );
};
