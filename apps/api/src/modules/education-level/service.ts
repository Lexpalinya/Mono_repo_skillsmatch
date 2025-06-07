import {
  IComboboxDtoType,
  IEducationLevelCreateDtoType,
  IEducationLevelPaginationDtoType,
  IEducationLevelUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";
import { Prisma } from "@prisma/client";

export const CreateEducationLevel = async (
  data: IEducationLevelCreateDtoType
) => {
  await ensureUniqueRecord({
    table: "educationLevel",
    column: "name",
    value: data.name,
  });
  const educationLevel = await prisma.educationLevel.create({
    data,
  });
  return educationLevel;
};

export const UpdateEducationLevel = async (
  id: string,
  data: IEducationLevelUpdateDtoType
) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "educationLevel",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({
    table: "educationLevel",
    column: "id",
    value: id,
  });
  const educationLevel = await prisma.educationLevel.update({
    where: {
      id,
    },
    data,
  });
  return educationLevel;
};

export const DeleteEducationLevel = async (id: string) => {
  await ensureRecordExists({
    table: "educationLevel",
    column: "id",
    value: id,
  });
  const educationLevel = await prisma.educationLevel.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return educationLevel;
};

export const GetEducationLevel = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IEducationLevelPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;
    const items = await queryTable("educationLevel", {
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

export const GetStatsEducationLevel = async () => {
  try {
    const total = await prisma.educationLevel.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.educationLevel.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsedPost] = await prisma.educationLevel.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.educationLevel.findMany({
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

export const GetEducationLevelById = async (id: string) => {
  const educationLevel = await prisma.educationLevel.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return educationLevel;
};

export const GetEducationLevelCombobox = async (
  input: IComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const where: Prisma.EducationLevelWhereInput = {
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
    const items = await queryTable("educationLevel", {
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
