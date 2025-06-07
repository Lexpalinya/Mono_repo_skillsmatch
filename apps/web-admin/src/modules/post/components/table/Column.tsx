import { ArrowUpDown, Clock } from "lucide-react";
import {
  Badge,
  Button,
  Calendar,
  Checkbox,
  DataTableColumnHeader,
} from "@skillsmatch/ui";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import type { IPostAdminDtoType } from "@skillsmatch/dto";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import PostAction from "./Action";

export const companyColumns: ColumnDef<IPostAdminDtoType>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{post.title}</div>
          <div className="text-sm text-muted-foreground">
            GPA: {post.gpa} • {post.workday.length} days/week
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "company.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
    cell: ({ row }) => {
      const company = row.original.company;
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate">{company?.name}</div>
          <div className="text-sm text-muted-foreground truncate">
            {company?.address}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "salary",
    header: "Salary & Schedule",
    cell: ({ row }) => {
      const post = row.original;
      const checkIn = formatTime(post.checkInTime);
      const checkOut = formatTime(post.checkOutTime);

      return (
        <div className="text-sm space-y-1">
          <div className="font-medium">
            {post.currency} {post.minSalary.toLocaleString()} -{" "}
            {post.maxSalary.toLocaleString()}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {checkIn} - {checkOut}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "positions",
    header: "Positions & Skills",
    cell: ({ row }) => {
      const post = row.original;
      const positions = post.PostJobPositionDetail ?? [];

      return (
        <div className="max-w-[200px]">
          {positions.length > 0 ? (
            <div className="space-y-1">
              {positions.slice(0, 2).map((position, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium truncate">{position.jp.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {position.PostJobPositionDetailSkill.length} skills
                  </div>
                </div>
              ))}
              {positions.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{positions.length - 2} more positions
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No positions</span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endDate = new Date(row.original.endDate);
      const isExpired = endDate < new Date();

      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div className={isExpired ? "text-red-600" : ""}>
              {formatDate(row.original.endDate)}
            </div>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
          </div>
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
    cell: PostAction,
  },
];
