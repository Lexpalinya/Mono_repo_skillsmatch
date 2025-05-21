import { CourseColumn } from "./Column"; // Adjust the path if needed
import { useCourse } from "../../context/useCourse"; // Adjust the path if needed
import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar"; // Reuse if the same, or change if needed

export const CourseTable = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useCourse();

  return (
    <DataTable
      columns={CourseColumn}
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
