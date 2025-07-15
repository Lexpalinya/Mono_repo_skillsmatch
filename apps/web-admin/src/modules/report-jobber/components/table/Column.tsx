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

export const ReportjobberColumns: ColumnDef<IJobberAdminDtoType>[] = [
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
    id: "jobberDetail",
    header: () => <div className="text-left">Jobber Profile</div>,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="border-3 rounded p-3 w-full text-sm space-y-2">
          {/* Row 1 */}
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            {/* รูปภาพ */}
            <div className="flex justify-center">
              <FullImageViewer
                width={90}
                height={90}
                src={data.member?.profile || "/placeholder.svg"}
                alt={`${data.firstName} ${data.lastName}`}
                className="rounded object-cover"
              />
            </div>

            {/* ข้อมูลฝั่งขวา */}
            <div className="space-y-2 pl-2 border-l">
              {/* Row 1: Name, Surname, Age */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  {data.firstName}
                  {"    "}
                  {data.lastName}
                  {"    ,"}
                  {calculateAge(data.birthday)}
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  Email: {data.member?.username || "-"}
                </div>
              </div>

              {/* Row 3: Phone */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  ເບີໂທ: {data.member?.phoneNumber || "-"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  {data.isActive ? "ກຳລັງຫາວຽກ" : "ບໍ່ໄດ້ຫາວຽກ"}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 */}

          {/* Row 5: Current Address */}
          <div className="grid grid-cols-4 items-center gap-2 border-b pb-1">
            <div className="font-semibold">ທີ່ຢູ່ປັດຈຸບັນ</div>
            <div>ບ້ານ: {data.cVillage || "-"}</div>
            <div>ເມືອງ: {data.cDistrict || "-"}</div>
            <div>ແຂວງ: {data.cProvince || "-"}</div>
          </div>

          {/* Row 6: Hometown */}
          <div className="grid grid-cols-4 items-center gap-2 border-b">
            <div className="font-semibold">ບ້ານເກີດ</div>
            <div>ບ້ານ: {data.bVillage || "-"}</div>
            <div>ເມືອງ: {data.bDistrict || "-"}</div>
            <div>ແຂວງ: {data.bProvince || "-"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold">ຂໍ້ມູນນັກສຶກສາ</div>
            <div>ສະຖາບັນ: </div>
            <div>
              {data.JobberProfile?.educationalInstitutions?.name || "-"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold"></div>
            <div>ລະດັບ: </div>
            <div>{data.JobberProfile?.educationLevels?.name || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold"></div>
            <div>ຄະນະ: </div>
            <div>{data.JobberProfile?.major?.name || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold"></div>
            <div>ສາຂາ: </div>
            <div>{data.JobberProfile?.course?.name || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold"></div>
            <div>GPA: </div>
            <div>{data.JobberProfile?.gpa || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold"></div>
            <div>ເງິນເດືອນເລີ່ມຕົ້ນ: </div>
            <div>{data.JobberProfile?.startSalary || "-"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2 ">
            <div className="font-semibold"></div>
            <div>ເວລາເຮັດວຽກ: </div>
            <div>
              {(data.JobberProfile?.checkInTime || "N/A") +
                " - " +
                (data.JobberProfile?.checkOutTime || "N/A")}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-2 border-b">
            <div className="font-semibold"></div>
            <div>ວັນເຮັດວຽກ: </div>
            <div>
              {" "}
              {Array.isArray(data.JobberProfile?.workDay) &&
              data.JobberProfile.workDay.length > 0
                ? data.JobberProfile.workDay.join(", ")
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2 border-b">
            <div className="font-semibold">ຕຳແໜ່ງທີ່ສົນໃຈ</div>
            <div>
              {" "}
              {Array.isArray(data.ApplyForJob) && data.ApplyForJob.length > 0
                ? data.ApplyForJob.map((item) => item.jp).join(", ")
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <div className="font-semibold">ທັກສະ</div>
            <div>
              {" "}
              {data?.JobberProfile?.JobberProfileSkill?.length > 0
                ? data.JobberProfile.JobberProfileSkill.map(
                    (item) => item?.skill?.name ?? ""
                  )
                    .filter((name) => name !== "")
                    .join(", ")
                : "-"}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: JobberAction,
  },
];
