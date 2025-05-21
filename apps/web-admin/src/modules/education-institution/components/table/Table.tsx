import { EducationalInstitutionColumn } from "./Column";
import { useEducationalInstitution } from "../../context/useEducationalInstitution";
import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar";

export const EducationalInstitutionTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useEducationalInstitution();

  return (
    <DataTable
      columns={EducationalInstitutionColumn}
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
