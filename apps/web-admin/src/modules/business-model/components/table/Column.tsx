import { formatDateTime } from "@/utils/formatDateTime";
import type { IBusinessModelAdminDtoType } from "@skillsmatch/dto";
import { Badge, Checkbox, cn, DataTableColumnHeader } from "@skillsmatch/ui";
import type { ColumnDef } from "@tanstack/react-table";
import BusinessModelAction from "./Action";
export const BusinessModelColumn: ColumnDef<IBusinessModelAdminDtoType>[] = [
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
      <DataTableColumnHeader column={column} title="Business Model Name" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "companyUsageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Usage Count" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.companyUsageCount}</div>
    ),
  },
  {
    accessorKey: "visible",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visibility" />
    ),
    cell: ({ row }) => {
      const visible = row.original.visible;
      return (
        <Badge variant={visible ? "default" : "secondary"}>
          {visible ? "Visible" : "Hidden"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {formatDateTime(row.original.createdAt)}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {formatDateTime(row.original.updatedAt)}
      </div>
    ),
  },
  {
    id: "actions",
    cell: BusinessModelAction,
  },
];
