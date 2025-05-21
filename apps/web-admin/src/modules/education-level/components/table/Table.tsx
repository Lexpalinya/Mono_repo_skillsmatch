import { EducationLevelColumn } from "./Column"; 
import { useEducationLevel } from "../../context/useEducationLevel";
import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar";

export const EducationLevelTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useEducationLevel();

  return (
    <DataTable
      columns={EducationLevelColumn}
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
