import { IMemberCreateDtoType, IMemberUpdateDtoType } from "@skillsmatch/dto";

import prisma from "@lib/prisma-client";
import { ensureUniqueRecord } from "@utils/ensure";
import { HashedPassword } from "@utils/password";
import { TRPCError } from "@trpc/server";

import { QueryOptions, queryTable } from "@utils/pagination";
import { Member } from "@prisma/client";

export const CreateMember = async (data: IMemberCreateDtoType) => {
    try {
        await Promise.all([
            ensureUniqueRecord({ table: "member", column: "email", value: data.email }),
            ensureUniqueRecord({ table: "member", column: "username", value: data.username }),
            ensureUniqueRecord({ table: "member", column: "phoneNumber", value: data.phoneNumber }),
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

export const UpdateMember = async (data: IMemberUpdateDtoType & { id: string }) => {
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
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Member>) => {
    try {
        const members = await queryTable("member", {
            where,
            page,
            pageSize,
            orderBy,
            include,
        });

        return members;
    } catch (error) {
        throw error;
    }
};
