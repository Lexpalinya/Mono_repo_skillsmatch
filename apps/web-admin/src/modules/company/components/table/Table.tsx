import { useCompany } from "../../context/useCompany";
import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar/ToolsBar";
import { companyColumns } from "./Column"; // สมมติเปลี่ยน columns เป็น companyColumns

export const CompanyTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useCompany();

  return (
    <DataTable
      columns={companyColumns}
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
