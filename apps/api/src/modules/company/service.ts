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
import { updateUsageCount } from "./utils/updateUsageCount";

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
  const company = await
    prisma.$transaction(async (tx) => {
      const companyData = await tx.company.create({
        data,
      })


      await updateUsageCount({
        tx, model: "businessModel",
        countField: "companyUsageCount", foreignKeyId: companyData.bmId, companyField: "bmId"
      })
      return companyData

    })

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

  const oldCompany = await ensureRecordExists({ table: "company", column: "id", value: id });

  const company = await prisma.$transaction(async (tx) => {

    const companyData = await tx.company.update({
      where: { id },
      data,
    });

    await updateUsageCount({
      tx, model: "businessModel",
      countField: "companyUsageCount", foreignKeyId: companyData.bmId, companyField: "bmId"
    })
    await updateUsageCount({
      tx, model: "businessModel",
      countField: "companyUsageCount", foreignKeyId: oldCompany.bmId, companyField: "bmId"
    })
    return companyData
  })
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
  status,
  startDate,
  endDate
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
    if (status) {
      if (status == "1") {
        where = {
          ...where,
          isVerify: true,
        }
      } else if (status == "2") {
        where = {
          ...where,
          isVerify: false,
        }
      }

    }

    if (startDate || endDate) {
      where = {
        ...where,
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && {
            lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
          }),
        },
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
      _count: {
        select: {
          Post: true
        }
      }
    };

    const items = await queryTable("company", {
      page,
      limit,
      where,
      select,
      orderBy: sortBy === "Postamont" ? undefined : {
        [sortBy ?? "createdAt"]: sortOrder,
      },
    });

    items.data = items.data.map((company: any) => ({
      ...company,
      Postamont: company._count.Post,
    }));

    if (sortBy === "Postamont") {
      const multiplier = sortOrder === "desc" ? -1 : 1;
      items.data.sort((a: any, b: any) => (a.Postamont - b.Postamont) * multiplier);
    }



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

export const GetCompanyByMemberId = async (id: string) => {
  try {
    const company = await prisma.company.findFirst({
      where: {
        memberId: id,
        isActive: true,
      },
      include: {
        bm: {
          select:
          {
            id: true,
            name: true
          }
        }
      }

    });

    return company
  } catch (error) {
    console.log('error', error)
  }
};
export const GetStatsCompany = async (): Promise<ICompanyStatusDtoType> => {
  try {
    const [total, active, verified, status, notverified] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({
        where: {
          isActive: true,
        },
      }),
      prisma.company.count({
        where: {
          isVerify: true,
        },
      }),
      prisma.company.count({
        where: {
          isActive: true,
        },
      }),
      prisma.company.count({
        where: {
          isVerify: false,
        },
      }),
    ]);

    return { total, active, verified, status, notverified };
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



export const GetCompanyCard = async ({ search }: Omit<ICompanyPaginationDtoType, "sortOrder" | "sortBy">) => {
  try {
    const select: Prisma.CompanySelect = {
      id: true,
      name: true,
      province: true,
      district: true,
      village: true,
      member: {
        select: {
          profile: true
        }
      },
      bm: {
        select: {
          name: true
        }
      }
    }
    const items = await queryTable("company", {
      page: 1,
      limit: 1000,
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      select,
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log('items.data :>> ', items.data);
    return items.data
  } catch (error) {

  }
}