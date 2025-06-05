import { CheckCircle, XCircle } from "lucide-react";
import {
  Badge,
  Checkbox,
  DataTableColumnHeader,
  FullImageViewer,
} from "@skillsmatch/ui";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import type { IJobberAdminDtoType } from "@skillsmatch/dto";
import { calculateAge } from "@/utils/extractChangedFields";
import JobberAction from "./Action";

export const jobberColumns: ColumnDef<IJobberAdminDtoType>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <FullImageViewer
            width={35}
            height={35}
            src={data.member?.profile || "/placeholder.svg?height=80&width=80"}
            alt={`${data.firstName} ${data.lastName}`}
          />
          <div>
            <div className="font-medium">
              {data.firstName} {data.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.member?.username}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, value) => {
      const data = row.original;
      const search = value.toLowerCase();
      return (
        `${data.firstName} ${data.lastName}`.toLowerCase().includes(search) ||
        (data.member?.username?.toLowerCase().includes(search) ?? false)
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "birthday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => {
      const birthday = row.getValue("birthday") as Date;

      const age = calculateAge(birthday);
      return <div>{age}</div>;
    },
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status?.name ?? "Unknown";
      function getStatusBadgeColor({
        status,
      }: {
        status: string;
      }):
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | null
        | undefined {
        if (status === "Active") {
          return "default";
        } else if (status === "Pending") {
          return "outline";
        } else if (status === "Suspended") {
          return "destructive";
        } else {
          return "secondary";
        }
      }
      const variant = getStatusBadgeColor({ status });

      return <Badge variant={variant}>{status}</Badge>;
    },
    filterFn: (row, value) => {
      if (value === "all") return true;
      return row.original.status?.name === value;
    },
  },
  {
    accessorKey: "isVerify",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification" />
    ),
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerify");
      return (
        <div className="flex items-center">
          {isVerified ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Unverified
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: JobberAction,
  },
];
