import {
  IComboboxDtoType,
  IJobPositionCreateDtoType,
  IJobPositionPaginationDtoType,
  IJobPositionUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";
import { Prisma } from "@prisma/client";

export const CreateJobPosition = async (data: IJobPositionCreateDtoType) => {
  await ensureUniqueRecord({
    table: "jobPosition",
    column: "name",
    value: data.name,
  });
  const jobPosition = await prisma.jobPosition.create({
    data,
  });
  return jobPosition;
};

export const UpdateJobPosition = async (
  id: string,
  data: IJobPositionUpdateDtoType
) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "jobPosition",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "jobPosition", column: "id", value: id });
  const jobPosition = await prisma.jobPosition.update({
    where: { id },
    data,
  });
  return jobPosition;
};

export const DeleteJobPosition = async (id: string) => {
  await ensureRecordExists({ table: "jobPosition", column: "id", value: id });
  const jobPosition = await prisma.jobPosition.update({
    where: { id },
    data: { isActive: false },
  });
  return jobPosition;
};

export const GetJobPosition = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IJobPositionPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;
    const items = await queryTable("jobPosition", {
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

export const GetStatsJobPosition = async () => {
  try {
    const total = await prisma.jobPosition.count({
      where: { isActive: true },
    });
    const active = await prisma.jobPosition.count({
      where: { isActive: true, visible: true },
    });
    const [mostUsedPost] = await prisma.jobPosition.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.jobPosition.findMany({
      orderBy: { jobberUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    return { total, active, mostUsedPost, mostUsedJobber };
  } catch (error) {
    throw error;
  }
};

export const GetJobPositionById = async (id: string) => {
  const jobPosition = await prisma.jobPosition.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return jobPosition;
};

export const GetJobPositionCombobox = async (
  input: IComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const where: Prisma.JobPositionWhereInput = {
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
    const items = await queryTable("jobPosition", {
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
