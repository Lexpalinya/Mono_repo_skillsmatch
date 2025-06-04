import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Company, Prisma } from "@prisma/client";
import {
  ICompanyCreateDTOType,
  ICompanyPaginationDtoType,
  ICompanyStatusDtoType,
  ICompanyUpdateDTOType,
} from "@skillsmatch/dto";

export const CreateCompany = async (data: ICompanyCreateDTOType) => {
  await ensureUniqueRecord({
    table: "company",
    column: "memberId",
    value: data.memberId,
  });
  await ensureUniqueRecord({
    table: "company",
    column: "taxPayId",
    value: data.taxPayId,
  });

  const company = await prisma.company.create({ data });
  return company;
};

export const UpdateCompany = async (
  id: string,
  data: ICompanyUpdateDTOType
) => {
  if (data.memberId) {
    await ensureUniqueRecord({
      table: "company",
      column: "memberId",
      value: data.memberId,
    });
  }
  if (data.taxPayId) {
    await ensureUniqueRecord({
      table: "company",
      column: "taxPayId",
      value: data.taxPayId,
    });
  }

  await ensureRecordExists({ table: "company", column: "id", value: id });

  const company = await prisma.company.update({
    where: { id },
    data,
  });
  return company;
};

export const DeleteCompany = async (id: string) => {
  await ensureRecordExists({ table: "company", column: "id", value: id });

  const company = await prisma.company.update({
    where: { id },
    data: { isActive: false },
  });
  return company;
};

export const GetCompany = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  status,
}: ICompanyPaginationDtoType) => {
  try {
    let where: Prisma.JobberWhereInput = { isActive: true };

    if (search) {
      where = {
        AND: { isActive: true },
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { member: { username: { contains: search, mode: "insensitive" } } },
        ],
      };
    }
    if (status) {
      where = {
        ...where,
        statusId: status,
      };
    }

    const select: Prisma.CompanySelect = {
      id: true,
      memberId: true,

      isVerify: true,

      createdAt: true,

      reason: true,

      member: {
        select: {
          username: true,
          profile: true,
          email: true,
        },
      },
    };

    const items = await queryTable("company", {
      page,
      limit,
      where,
      select,
      orderBy: {
        [sortBy ?? "createdAt"]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    throw error;
  }
};

export const GetCompanyById = async (id: string) => {
  const company = await prisma.company.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return company;
};

export const GetStatsCompany = async (): Promise<ICompanyStatusDtoType> => {
  try {
    const [total, active, verified, status] = await Promise.all([
      prisma.company.count({
        where: { isActive: true },
      }),
      prisma.company.count({
        where: {
          isActive: true,
        },
      }),
      prisma.company.count({
        where: {
          isActive: true,
        },
      }),
      prisma.company.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return { total, active, verified, status };
  } catch (error) {
    throw error;
  }
};
