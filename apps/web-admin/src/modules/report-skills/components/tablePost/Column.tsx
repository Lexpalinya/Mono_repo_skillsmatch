
import type { ISkillAdminDtoType } from "@skillsmatch/dto";
import { Checkbox, cn, DataTableColumnHeader } from "@skillsmatch/ui";
import type { ColumnDef } from "@tanstack/react-table";
import SkillAction from "./Action";

export const SkillColumn: ColumnDef<ISkillAdminDtoType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Skill Name" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "postUsageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Post Usage Count" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.postUsageCount}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
         {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}

      </div>
    ),
  },

  {
    id: "actions",
    cell: SkillAction,
  },
];
