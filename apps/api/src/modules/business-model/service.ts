import {
  IBusinessModelCreateDtoType,
  IBusinessModelPaginationDto,
  IBusinessModelUpdateDtoType,
} from "@skillsmatch/dto";

import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { QueryOptions, queryTable } from "../../utils/pagination";
import { BusinessModel } from "@prisma/client";

export const CreateBusinessModel = async (
  data: IBusinessModelCreateDtoType
) => {
  await ensureUniqueRecord({
    table: "businessModel",
    column: "name",
    value: data.name,
  });
  const businessModel = await prisma.businessModel.create({
    data,
  });
  return businessModel;
};
export const UpdateBusinessModel = async (
  id: string,
  data: IBusinessModelUpdateDtoType
) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "businessModel",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "businessModel", column: "id", value: id });
  const businessModel = await prisma.businessModel.update({
    where: {
      id,
    },
    data,
  });
  return businessModel;
};

export const DeleteBusinessModel = async (id: string) => {
  await ensureRecordExists({ table: "businessModel", column: "id", value: id });
  const businessModel = await prisma.businessModel.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return businessModel;
};

export const GetBusinessModel = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: IBusinessModelPaginationDto) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;

    const members = await queryTable("businessModel", {
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

export const GetStatsBusinessModel = async () => {
  try {
    const total = await prisma.businessModel.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.businessModel.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsed] = await prisma.businessModel.findMany({
      orderBy: { companyUsageCount: "desc" },
      select: { id: true, name: true, companyUsageCount: true },
      take: 1,
    });

    return { total, active, mostUsed };
  } catch (error) {
    throw error;
  }
};

export const GetBusinessModelById = async (id: string) => {
  const businessModel = await prisma.businessModel.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return businessModel;
};
