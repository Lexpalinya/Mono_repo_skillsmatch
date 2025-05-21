import {
  IEducationalInstitutionCreateDtoType,
  IEducationalInstitutionPaginationDtoType,
  IEducationalInstitutionUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";

export const CreateEducationalInstitution = async (data: IEducationalInstitutionCreateDtoType) => {
  await ensureUniqueRecord({
    table: "educationalInstitution",
    column: "name",
    value: data.name,
  });
  const institution = await prisma.educationalInstitution.create({
    data,
  });
  return institution;
};

export const UpdateEducationalInstitution = async (id: string, data: IEducationalInstitutionUpdateDtoType) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "educationalInstitution",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "educationalInstitution", column: "id", value: id });
  const institution = await prisma.educationalInstitution.update({
    where: {
      id,
    },
    data,
  });
  return institution;
};

export const DeleteEducationalInstitution = async (id: string) => {
  await ensureRecordExists({ table: "educationalInstitution", column: "id", value: id });
  const institution = await prisma.educationalInstitution.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return institution;
};

export const GetEducationalInstitution = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IEducationalInstitutionPaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;
    const items = await queryTable("educationalInstitution", {
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

export const GetStatsEducationalInstitution = async () => {
  try {
    const total = await prisma.educationalInstitution.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.educationalInstitution.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsedPost] = await prisma.educationalInstitution.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.educationalInstitution.findMany({
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

export const GetEducationalInstitutionById = async (id: string) => {
  const institution = await prisma.educationalInstitution.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return institution;
};
