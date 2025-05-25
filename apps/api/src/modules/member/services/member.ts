import {
  IMemberCreateDtoType,
  IMemberPaginationDtoType,
  IMemberUpdateDtoType,
} from "@skillsmatch/dto";

import { TRPCError } from "@trpc/server";

import { Member, Prisma, PrismaClient } from "@prisma/client";
import { ensureUniqueRecord } from "../../../utils/ensure";

import { HashedPassword } from "../../../utils/password";
import { QueryOptions, queryTable } from "../../../utils/pagination";
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
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (role) where.role = role;
    const select: Prisma.MemberSelect = {
      id: true,
      email: true,
      username: true,
      profile: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      block: true,
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
