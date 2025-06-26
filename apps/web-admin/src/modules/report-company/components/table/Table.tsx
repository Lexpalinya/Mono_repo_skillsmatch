import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar/ToolsBar";

import { useReportCompany } from "../../context/useReportCompany";
import { reportcompanyColumns } from "./Column";

export const ReportCompanyTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useReportCompany();

  return (
    <DataTable
      columns={reportcompanyColumns}
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
