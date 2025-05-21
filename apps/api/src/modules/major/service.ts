import {
  IMajorCreateDtoType,
  IMajorPaginationDtoType,
  IMajorUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";

export const CreateMajor = async (data: IMajorCreateDtoType) => {
  await ensureUniqueRecord({
    table: "major",
    column: "name",
    value: data.name,
  });
  const major = await prisma.major.create({
    data,
  });
  return major;
};

export const UpdateMajor = async (id: string, data: IMajorUpdateDtoType) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "major",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "major", column: "id", value: id });
  const major = await prisma.major.update({
    where: {
      id,
    },
    data,
  });
  return major;
};

export const DeleteMajor = async (id: string) => {
  await ensureRecordExists({ table: "major", column: "id", value: id });
  const major = await prisma.major.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return major;
};

export const GetMajor = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IMajorPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;
    const items = await queryTable("major", {
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

export const GetStatsMajor = async () => {
  try {
    const total = await prisma.major.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.major.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsedPost] = await prisma.major.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.major.findMany({
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

export const GetMajorById = async (id: string) => {
  const major = await prisma.major.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return major;
};
