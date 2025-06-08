import {
  IMemberComboboxDtoType,
  IMemberCreateDtoType,
  IMemberPaginationDtoType,
  IMemberUpdateDtoType,
} from "@skillsmatch/dto";

import { TRPCError } from "@trpc/server";

import { Prisma } from "@prisma/client";
import { ensureUniqueRecord } from "@utils/ensure";

import { HashedPassword } from "@utils/password";
import { queryTable } from "@utils/pagination";
import prisma from "@lib/prisma-client";

export const CreateMember = async (data: IMemberCreateDtoType) => {
  try {
    await Promise.all([
      ensureUniqueRecord({
        table: "member",
        column: "email",
        value: data.email,
      }),
      ensureUniqueRecord({
        table: "member",
        column: "username",
        value: data.username,
      }),
      ensureUniqueRecord({
        table: "member",
        column: "phoneNumber",
        value: data.phoneNumber,
      }),
    ]);

    const member = await prisma.member.create({
      data: {
        ...data,
        password: await HashedPassword(data.password),
      },
    });

    return member;
  } catch (error) {
    console.error("Error occurred while creating a member:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while creating the member.",
    });
  }
};

export const UpdateMember = async (
  data: IMemberUpdateDtoType & { id: string }
) => {
  try {
    if (data.password) {
      data.password = await HashedPassword(data.password);
    }
    const member = await prisma.member.update({
      where: { id: data.id },
      data,
    });

    if (!member) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Member not found",
      });
    }

    return member;
  } catch (error) {
    console.error("Error occurred while updating a member:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while updating the member.",
    });
  }
};

export const DeleteMember = async (id: string[]) => {
  try {
    const member = await prisma.member.updateMany({
      where: {
        id: { in: id },
      },
      data: { isActive: false },
    });

    return member;
  } catch (error) {
    console.error("Error occurred while fetching the member:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching the member.",
    });
  }
};

export const GetMember = async (id: string) => {
  try {
    const member = await prisma.member.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        Company: {
          select: {
            id: true,
          },
        },
        Jobber: {
          select: {
            id: true,
          },
        },
      },
    });

    return member;
  } catch (error) {
    console.error("Error occurred while fetching members:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching members.",
    });
  }
};

export const GetMembers = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  role,
}: IMemberPaginationDtoType) => {
  try {
    let where: Prisma.MemberWhereInput = { isActive: true };
    if (search) {
      where = {
        ...where,
        OR: [
          {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phoneNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    if (role) where.role = role;
    const select: Prisma.MemberSelect = {
      id: true,
      visible: true,
      email: true,
      username: true,
      profile: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      block: true,
      background: true,
      password: true,
    };
    const items = await queryTable("member", {
      page,
      limit,
      where,
      select,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    console.error("Error occurred while fetching member combobox data:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching member combobox data.",
    });
  }
};

export const GetStatsMember = async () => {
  try {
    const [total, active, jobber, company] = await Promise.all([
      prisma.member.count({
        where: { isActive: true },
      }),
      prisma.member.count({
        where: { isActive: true, visible: true },
      }),
      prisma.member.count({
        where: { isActive: true, visible: true, role: "jobber" },
      }),
      prisma.member.count({
        where: { isActive: true, visible: true, role: "company" },
      }),
    ]);

    return { total, active, jobber, company };
  } catch (error) {
    console.error("Error occurred while fetching member combobox data:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching member combobox data.",
    });
  }
};

export const GetMemberCombobox = async (
  input: IMemberComboboxDtoType
): Promise<Array<{ value: string; label: string }>> => {
  const where: Prisma.MemberWhereInput = {
    isActive: true,
    visible: true,
    role: input.role,
    OR: [
      {
        username: {
          contains: input.search,
          mode: "insensitive",
        },
      },
      {
        phoneNumber: {
          contains: input.search,
          mode: "insensitive",
        },
      },
    ],
  };

  const query = await queryTable("member", {
    page: input.offset,
    limit: input.limit,
    where,
    select: {
      id: true,
      username: true,
      phoneNumber: true,
      role: true,
    },
    orderBy: {
      username: "asc",
    },
  });

  return query.data.map(
    (item: {
      id: string;
      username: string;
      phoneNumber: string;
      role: string;
    }) => ({
      value: item.id,
      label: `(${item.phoneNumber}) (${item.role.toUpperCase()}) ${item.username} `,
    })
  );
};
