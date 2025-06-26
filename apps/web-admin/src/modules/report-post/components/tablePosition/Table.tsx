import { DataTable } from "@skillsmatch/ui";


import ToolsBar from "./ToolsBar/ToolsBar";
import { useReportPost } from "../../context/useReportPost";
import { reportpostColumns } from "./Column";

export const ReportPostTablePostion = () => {
  const {
    tableQueryMosJobposition: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    rowSelection,
    setRowSelection,
  } = useReportPost();
  console.log(data)
  return (
    <DataTable
      columns={reportpostColumns}
      renderToolbar={(table) => <ToolsBar table={table} />}
      data={data?.data ?? []}
      rowCount={data?.data.length}
      isLoading={isLoading}
      isPending={isPending}
      isFetching={isFetching}
      error={error}
      {...stateAndOnChanges}
      rowSelection={rowSelection}
      onRowSelectionChange={(rows, newSelection) => {
        setRowSelection(newSelection);
      }}
    />
  );
};
