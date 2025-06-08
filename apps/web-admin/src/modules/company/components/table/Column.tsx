import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  DataTableColumnHeader,
  FullImageViewer,
} from "@skillsmatch/ui";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import type { ICompanyAdminDataType } from "@skillsmatch/dto";

import JobberAction from "./Action";

export const companyColumns: ColumnDef<ICompanyAdminDataType>[] = [
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
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <FullImageViewer
            width={35}
            height={35}
            src={data.member?.profile ?? "/placeholder.svg?height=80&width=80"}
            alt={`${data.member.username} `}
          />
          <div>
            <div>
              <div className="font-medium">{data.name}</div>
              <div className="text-xs text-muted-foreground">
                {data.member.username}
              </div>
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, value) => {
      const data = row.original;
      const search = value.toLowerCase();
      return (
        `${data.owner_firstname} ${data.owner_lastname}`
          .toLowerCase()
          .includes(search) === true
      );
    },
  },
  {
    accessorKey: "owner_firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
    cell: ({ row }) => (
      <p>
        {row.original.owner_firstname} {row.original.owner_lastname}
      </p>
    ),
  },
  {
    accessorKey: "bmId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Model" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.bm?.name}</div>;
    },
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-wrap">
          {row.original.province}, {row.original.district},{" "}
          {row.original.village}
        </div>
      );
    },
  },

  {
    accessorKey: "isVerify",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
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
  {
    id: "actions",
    cell: JobberAction,
  },
];
