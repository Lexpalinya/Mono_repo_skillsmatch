import {
  IComboboxDtoType,
  IJobberStatusCreateDtoType,
  IJobberStatusPaginationDtoType,
  IJobberStatusUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";
import { Prisma } from "@prisma/client";

export const CreateJobberStatus = async (data: IJobberStatusCreateDtoType) => {
  await ensureUniqueRecord({
    table: "jobberStatus",
    column: "name",
    value: data.name,
  });
  const jobberStatus = await prisma.jobberStatus.create({
    data,
  });
  return jobberStatus;
};

export const UpdateJobberStatus = async (
  id: string,
  data: IJobberStatusUpdateDtoType
) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "jobberStatus",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "jobberStatus", column: "id", value: id });
  const jobberStatus = await prisma.jobberStatus.update({
    where: { id },
    data,
  });
  return jobberStatus;
};

export const DeleteJobberStatus = async (id: string) => {
  await ensureRecordExists({ table: "jobberStatus", column: "id", value: id });
  const jobberStatus = await prisma.jobberStatus.update({
    where: { id },
    data: { isActive: false },
  });
  return jobberStatus;
};

export const GetJobberStatus = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IJobberStatusPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;

    const items = await queryTable("jobberStatus", {
      page,
      limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    throw error;
  }
};

export const GetStatsJobberStatus = async () => {
  try {
    const total = await prisma.jobberStatus.count({
      where: { isActive: true },
    });
    const active = await prisma.jobberStatus.count({
      where: { isActive: true, visible: true },
    });

    const [mostUsed] = await prisma.jobberStatus.findMany({
      orderBy: { jobberUsageCount: "desc" },
      select: { id: true, name: true, jobberUsageCount: true },
      take: 1,
    });

    return { total, active, mostUsed };
  } catch (error) {
    throw error;
  }
};

export const GetJobberStatusById = async (id: string) => {
  const jobberStatus = await prisma.jobberStatus.findUniqueOrThrow({
    where: { id },
  });
  if (!jobberStatus.isActive) throw new Error("JobberStatus is inactive");
  return jobberStatus;
};

export const GetJobberStatusCombobox = async (
  input: IComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const where: Prisma.JobberStatusWhereInput = {
      isActive: true,
      visible: true,
      OR: [
        {
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ],
    };
    const items = await queryTable("jobberStatus", {
      page: input.offset,
      limit: input.limit,
      where,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return items.data.map((item: { id: string; name: string }) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    throw error;
  }
};
