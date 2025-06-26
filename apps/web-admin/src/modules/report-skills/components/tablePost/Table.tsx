import { SkillColumn } from "./Column";

import { DataTable } from "@skillsmatch/ui";
import ToolsBar from "./ToolsBar";
import { useReportSkill } from "../../context/useReportSkills";

export const ReportSkillTablePost = () => {
  const {
    tableQuery: { data, isLoading, isPending, isFetching, error },
    stateAndOnChanges,
    setSelectedIds,
    rowSelection,
    setRowSelection,
  } = useReportSkill();
  return (
    <DataTable
      columns={SkillColumn}
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
