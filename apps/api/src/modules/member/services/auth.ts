import {
  IMemberChangePasswordDtoType,
  IMemberCreateDtoType,
  IMemberLoginDtoType,
} from "@skillsmatch/dto";

import { Member } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { generateToken } from "../../../utils/jwt";
import { ensureRecordExists, ensureUniqueRecord } from "../../../utils/ensure";
import prisma from "../../../lib/prisma-client";
import { HashedPassword, VerifyPassword } from "../../../utils/password";

const getTokenForMember = (member: Member) =>
  generateToken({
    id: member.id,
    loginVersion: member.loginVersion,
    role: member.role,
  });

export const RegisterMember = async (data: IMemberCreateDtoType) => {
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

    return {
      member,
      token: getTokenForMember(member),
    };
  } catch (error) {
    throw error;
  }
};

export const LoginMember = async (data: IMemberLoginDtoType) => {
  try {
    const member: Member = await ensureRecordExists({
      table: "member",
      column: "phoneNumber",
      value: data.phoneNumber,
    });

    if (member.block) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your account has been blocked",
      });
    }

    const matchPassword = await VerifyPassword(data.password, member.password);
    if (!matchPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: { loginVersion: member.loginVersion + 1 },
    });

    return {
      member: updated,
      token: getTokenForMember(updated),
    };
  } catch (error) {
    throw error;
  }
};

export const ForgotPasswordMember = async (data: IMemberLoginDtoType) => {
  try {
    const member: Member = await ensureRecordExists({
      table: "member",
      column: "phoneNumber",
      value: data.phoneNumber,
    });

    if (member.block) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your account has been blocked",
      });
    }

    const matchPassword = await VerifyPassword(data.password, member.password);
    if (!matchPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: { loginVersion: member.loginVersion + 1 },
    });

    return updated;
  } catch (error) {
    throw error;
  }
};

export const ChangePasswordMember = async (
  data: IMemberChangePasswordDtoType
) => {
  try {
    const member: Member = await ensureRecordExists({
      table: "member",
      column: "id",
      value: data.id,
    });

    const matchPassword = await VerifyPassword(
      data.oldPassword,
      member.password
    );
    if (!matchPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        password: await HashedPassword(data.password),
      },
    });

    return updated;
  } catch (error) {
    throw error;
  }
};
