import {
  ISkillCreateDtoType,
  ISkillPaginationDtoType,
  ISkillUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";

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
    console.log('where :>> ', where);
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

export const GetSkillById = async (id: string) => {
  const skill = await prisma.skill.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return skill;
};
