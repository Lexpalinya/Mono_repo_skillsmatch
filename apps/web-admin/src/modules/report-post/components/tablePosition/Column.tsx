import { DataTableColumnHeader } from "@skillsmatch/ui";

import type { ColumnDef } from "@tanstack/react-table";

import type { IMostPostionDtoType } from "@skillsmatch/dto";

export const reportpostColumns: ColumnDef<IMostPostionDtoType>[] = [
  {
    id: "rowNumber",
    header: ({ column }) => (
      <div className="text-start w-full">
        <DataTableColumnHeader column={column} title="No" />
      </div>
    ),
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "w-[50px]",
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Position Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate">
            {row?.original?.name ?? "No Name"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Usage" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate">
            {row?.original?.totalAmount}
          </div>
        </div>
      );
    },
  },
];
