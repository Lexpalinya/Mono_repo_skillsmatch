import {
  IMemberComboboxDtoType,
  IMemberCreateDtoType,
  IMemberPaginationDtoType,
  IMemberUpdateDtoType,
} from "@skillsmatch/dto";

import { TRPCError } from "@trpc/server";

import { Member, Prisma, PrismaClient } from "@prisma/client";
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const GetStatsMember = async () => {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      select: { role: true },
    });

    const total = members.length;
    const active = members.filter((m) => m.role !== "admin").length;
    const jobber = members.filter((m) => m.role === "jobber").length;
    const company = members.filter((m) => m.role === "company").length;

    return { total, active, jobber, company };
  } catch (error) {
    throw error;
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
