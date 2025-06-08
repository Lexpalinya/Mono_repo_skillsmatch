import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { queryTable } from "@utils/pagination";
import { Prisma } from "@prisma/client";
import {
  IComboboxDtoType,
  ICompanyCreateDtoType,
  ICompanyPaginationDtoType,
  ICompanyStatusDtoType,
  ICompanyUpdateDtoType,
} from "@skillsmatch/dto";

export const CreateCompany = async (data: ICompanyCreateDtoType) => {
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
  data: ICompanyUpdateDtoType
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
  bmIds,
  verified,
}: ICompanyPaginationDtoType) => {
  try {
    let where: Prisma.CompanyWhereInput = { isActive: true };

    if (search) {
      where = {
        OR: [
          {
            owner_firstname: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            owner_lastname: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            province: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            district: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            village: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    if (bmIds) {
      where = {
        ...where,
        bmId: {
          in: bmIds,
        },
      };
    }

    if (verified) {
      where = {
        ...where,
        isVerify: verified,
      };
    }
    const select: Prisma.CompanySelect = {
      id: true,
      isVerify: true,
      name: true,
      taxPayId: true,
      owner_firstname: true,
      owner_lastname: true,
      bmId: true,
      createdAt: true,
      reason: true,
      memberId: true,
      province: true,
      district: true,
      village: true,
      member: {
        select: {
          username: true,
          profile: true,
          email: true,
        },
      },
      bm: {
        select: {
          name: true,
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
  const select = {
    id: true,
    isVerify: true,
    isActive: true,
    member: {
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        profile: true,
      },
    },
    memberId: true,
    name: true,
    bmId: true,
    bm: {
      select: {
        id: true,
        name: true,
      },
    },
    taxPayId: true,
    dob: true,
    owner_firstname: true,
    owner_lastname: true,
    province: true,
    district: true,
    village: true,
    docImage: true,
    reason: true,
    createdAt: true,
    updatedAt: true,
  };
  const company = await prisma.company.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
    select,
  });

  const companyPost = await prisma.post.count({
    where: {
      cId: company.id,
    },
  });
  return { ...company, postCount: companyPost };
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

export const GetCompanyCombobox = async (
  input: IComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const where: Prisma.CompanyWhereInput = {
      isActive: true,
      OR: [
        {
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ],
    };
    const items = await queryTable("company", {
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
