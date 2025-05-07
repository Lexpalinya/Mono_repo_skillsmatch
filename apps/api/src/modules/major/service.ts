import { IMajorCreateDtoType, IMajorUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Major } from "@prisma/client";

export const CreateMajor = async (data: IMajorCreateDtoType) => {
    await ensureUniqueRecord({ table: "major", column: "name", value: data.name });
    const major = await prisma.major.create({
        data
    });
    return major;
};

export const UpdateMajor = async (id: string, data: IMajorUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "major", column: "name", value: data.name });
    await ensureRecordExists({ table: "major", column: "id", value: id });
    const major = await prisma.major.update({
        where: {
            id
        },
        data
    });
    return major;
};

export const DeleteMajor = async (id: string) => {
    await ensureRecordExists({ table: "major", column: "id", value: id });
    const major = await prisma.major.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return major;
};

export const GetMajor = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Major>) => {
    try {
        const members = await queryTable("major", {
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

export const GetMajorById = async (id: string) => {
    const major = await prisma.major.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return major;
};
