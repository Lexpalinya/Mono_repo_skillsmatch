import {
  IBusinessModelCreateDtoType,
  IBusinessModelPaginationDto,
  IBusinessModelUpdateDtoType,
  IComboboxDtoType,
} from "@skillsmatch/dto";

import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { Prisma } from "@prisma/client";
import { queryTable } from "@utils/pagination";

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

export const GetBusinessModelCombobox = async (
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
    const items = await queryTable("businessModel", {
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
