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
        <div className="border-2 rounded p-3 w-full text-sm space-y-2">
          {/* Header */}

          <div className="grid grid-cols-[auto_1fr] items-start">
            <div className="flex flex-col items-center justify-center font-semibold pr-3 h-full">
              <p>{post.company?.name ?? "-"}</p>
              <p>/ {post.title}</p>
            </div>
            <div className="space-y-2 border-l">
              {/* Position Header */}
              <div className="grid grid-cols-3 bg-gray-200 px-4 py-1 font-semibold text-gray-700 border-b text-center">
                <div>ຕຳແໜ່ງ</div>
                <div>ຈຳນວນ</div>
                <div>ທັກສະທີ່ຕ້ອງການ</div>
              </div>

              {/* Positions */}
              {post.postJobPositionDetail?.map((pos, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 px-4 py-1 text-center"
                >
                  <div>{pos.jp?.name || "-"}</div>
                  <div>{pos.amount || "-"}</div>
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
          <div className="grid grid-cols-4 items-center gap-20 border-t pt-5 pr-5">
            <div className="font-semibold">ລາຍລະອຽດ:</div>
            <div>ເງຶນເດືອນ: </div>
            <div>
              {post.currency} {post.minSalary?.toLocaleString()} -{" "}
              {post.maxSalary?.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ເວລາເຮັດວຽກ: </div>
            <div>
              {post.checkInTime} - {post.checkOutTime}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>GPA ຂັ້ນຕ່ຳ: </div>
            <div>{post.gpa ?? "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ວັນເຮັດວຽກ: </div>
            <div>{post.workday?.join(", ") || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ລະດັບການສຶກສາ: </div>
            {post.postEducationLevel
              ?.map((e) => e?.educationLevel?.name)
              .join(", ") || "-"}
          </div>

          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ສະຖາບັນ: </div>
            {post.postEducationInstitution
              ?.map((i) => i?.ei?.name)
              .join(", ") || "-"}
          </div>

          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ຫຼັກສູດ: </div>
            {post.postCourse?.map((c) => c?.cr?.name).join(", ") || "-"}
          </div>

          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ສະຫວັດດີການ: </div>
            <div>{post?.welfare || "-"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-15">
            <div className="font-semibold"></div>
            <div>ລາຍລະອຽດເພີ່ມເຕີມ: </div>
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
