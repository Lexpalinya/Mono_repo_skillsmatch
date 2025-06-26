import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar/ToolsBar";


import { useReportJobber } from "../../context/useReportJobber";
import { ReportjobberColumns } from "./Column";

export const ReportJobberTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useReportJobber();

  return (
    <DataTable
      columns={ReportjobberColumns}
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
