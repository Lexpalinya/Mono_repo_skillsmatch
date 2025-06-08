import {
  IComboboxDtoType,
  ISkillCreateDtoType,
  ISkillPaginationDtoType,
  ISkillUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";
import { Prisma } from "@prisma/client";

export const CreateSkill = async (data: ISkillCreateDtoType) => {
  await ensureUniqueRecord({
    table: "skill",
    column: "name",
    value: data.name,
  });
  const skill = await prisma.skill.create({
    data,
  });
  return skill;
};

export const UpdateSkill = async (id: string, data: ISkillUpdateDtoType) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "skill",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "skill", column: "id", value: id });
  const skill = await prisma.skill.update({
    where: {
      id,
    },
    data,
  });
  return skill;
};

export const DeleteSkill = async (id: string) => {
  await ensureRecordExists({ table: "skill", column: "id", value: id });
  const skill = await prisma.skill.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return skill;
};

export const GetSkill = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: ISkillPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;

    const members = await queryTable("skill", {
      page,
      limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return members;
  } catch (error) {
    throw error;
  }
};

export const GetStatsSkill = async () => {
  try {
    const total = await prisma.skill.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.skill.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsedPost] = await prisma.skill.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.skill.findMany({
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

export const GetSkillById = async (id: string) => {
  const skill = await prisma.skill.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return skill;
};

export const GetSkillCombobox = async (
  input: IComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const where: Prisma.SkillWhereInput = {
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
    const items = await queryTable("skill", {
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
