import { ArrowUpDown, CheckCircle, UserRound, XCircle } from "lucide-react";
import {
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
} from "@skillsmatch/ui";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import { Avatar } from "@radix-ui/react-avatar";
import type { IJobberAdminDtoType } from "@skillsmatch/dto";

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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                data.member?.profile || "/placeholder.svg?height=32&width=32"
              }
              alt={`${data.firstName} ${data.lastName}`}
            />
            <AvatarFallback>
              <UserRound className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
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
    header: "Gender",
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "birthday",
    header: "Age",
    cell: ({ row }) => {
      const birthday = row.getValue("birthday") as Date;
      const age = new Date().getFullYear() - birthday.getFullYear();
      return <div>{age}</div>;
    },
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.name ?? "Unknown";
      const variant =
        status === "Active"
          ? "default"
          : status === "Pending"
            ? "outline"
            : status === "Suspended"
              ? "destructive"
              : "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },
    filterFn: (row, value) => {
      if (value === "all") return true;
      return row.original.status?.name === value;
    },
  },
  {
    accessorKey: "isVerify",
    header: "Verification",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerify") as boolean;
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
    filterFn: (row, value) => {
      if (value === "all") return true;
      const isVerified = row.getValue("isVerify") as boolean;
      return value === "verified" ? isVerified : !isVerified;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Joined
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM d, yyyy"),
  },
];
