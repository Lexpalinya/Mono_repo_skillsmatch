import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar";
import { useReviewApplication } from "../../context/useReviewApplication";
import { ReviewApplicationColumn } from "./Column";

export const ReviewApplicationTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useReviewApplication();

  return (
    <DataTable
      columns={ReviewApplicationColumn}
      renderToolbar={(table) => <ToolsBar table={table} />}
      data={data?.data ?? []}
      rowCount={data?.total ?? 0}
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
