import { formatDateTime } from "@/utils/formatDateTime";
import type { IMemberAdminDtoType } from "@skillsmatch/dto";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Checkbox,
  cn,
  DataTableColumnHeader,
  FullImageViewer,
} from "@skillsmatch/ui";
import type { ColumnDef } from "@tanstack/react-table";
import MemberAction from "./Action";
import { UserRound } from "lucide-react";

export const MemberColumn: ColumnDef<IMemberAdminDtoType>[] = [
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FullImageViewer
          width={35}
          height={35}
          src={row.original.profile || "/placeholder.svg?height=80&width=80"}
          alt={row.original.username}
        />
        <span className="font-medium">{row.original.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <Badge
          variant={
            role === "admin"
              ? "destructive"
              : role === "company"
                ? "default"
                : role === "jobber"
                  ? "secondary"
                  : "default"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "block",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Block status" />
    ),
    cell: ({ row }) => {
      const isBlocked = row.original.block;
      return isBlocked ? (
        <Badge variant="destructive">Blocked</Badge>
      ) : (
        <Badge variant="outline">Not Blocked</Badge>
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
    id: "actions",
    cell: MemberAction,
  },
];
