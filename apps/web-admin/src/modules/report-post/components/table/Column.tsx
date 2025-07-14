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
import { formatDate, formatTime2 } from "@/utils/formatDateTime";
import PostAction from "./Action";

export const reportpostColumns: ColumnDef<IPostAdminDtoType>[] = [
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
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="w-full border border-gray-300 rounded shadow text-sm">
          {/* Header */}

          <div className="grid grid-cols-[auto_1fr] items-start">
            <div className="flex flex-col items-center justify-center font-semibold pl-5 pr-5 h-full">
              <p>{post.company?.name ?? "-"}</p>
              <p>/ {post.title}</p>
            </div>
            <div className="space-y-2 border-l">
              {/* Position Header */}
              <div className="grid grid-cols-4 bg-gray-200 px-4 py-1 font-semibold text-gray-700 border-b text-center">
                <div>ຕຳແໜ່ງ</div>
                <div>ຈຳນວນ</div>
                <div className="col-span-2">ທັກສະທີ່ຕ້ອງການ</div>
              </div>

              {/* Positions */}
              {post.postJobPositionDetail?.map((pos, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 px-4 py-1 border-b text-center"
                >
                  <div>{pos.jp?.name || "-"}</div>
                  <div>{pos.jp?.amount || "-"}</div>
                  <div className="col-span-2">
                    {pos.PostJobPositionDetailSkill?.length > 0
                      ? pos.PostJobPositionDetailSkill.map((skill, i) => (
                          <span key={i} className="inline-block mr-1">
                            {"skill.skill?.name"}
                            {i < pos.PostJobPositionDetailSkill.length - 1
                              ? ","
                              : ""}
                          </span>
                        ))
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Section */}
          <div className="px-4 py-2 grid grid-cols-2 gap-2 border-t text-sm">
            <div className="font-semibold">Post Title:</div>
            <div>{post.title}</div>

            <div className="font-semibold">Salary:</div>
            <div>
              {post.currency} {post.minSalary?.toLocaleString()} -{" "}
              {post.maxSalary?.toLocaleString()}
            </div>

            <div className="font-semibold">Work Time:</div>
            <div>
              {formatTime2(post.checkInTime)} - {formatTime2(post.checkOutTime)}
            </div>

            <div className="font-semibold">Required GPA:</div>
            <div>{post.gpa ?? "-"}</div>

            <div className="font-semibold">Work Days:</div>
            <div>{post.workday?.join(", ") || "-"}</div>

            <div className="font-semibold">Education Level:</div>
            <div>
              {("post.educationLevels?.map((e) => e.name).join(", ")" || "-")}
            </div>

            <div className="font-semibold">Institution:</div>
            <div>
              {("post.institutions?.map((i) => i.name).join(", ")" || "-")}
            </div>

            <div className="font-semibold">Course:</div>
            <div>{("post.courses?.map((c) => c.name).join(", ")" || "-")}</div>

            <div className="font-semibold">Welfare:</div>
            <div>{post.welfare || "-"}</div>

            <div className="font-semibold">Additional Info:</div>
            <div>{post.more || "-"}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: PostAction,
  },
];
