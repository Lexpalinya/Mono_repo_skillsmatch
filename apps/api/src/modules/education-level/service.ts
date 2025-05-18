import { IEducationLevelCreateDtoType, IEducationLevelUpdateDtoType } from "@skillsmatch/dto";

import { Major } from "@prisma/client";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { QueryOptions, queryTable } from "../../utils/pagination";
import { EducationLevel } from "@prisma/client";

export const CreateEducationLevel = async (data: IEducationLevelCreateDtoType) => {
    await ensureUniqueRecord({ table: "educationLevel", column: "name", value: data.name });
    const educationLevel = await prisma.educationLevel.create({
        data
    });
    return educationLevel;
};

export const UpdateEducationLevel = async (id: string, data: IEducationLevelUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "educationLevel", column: "name", value: data.name });
    await ensureRecordExists({ table: "educationLevel", column: "id", value: id });
    const educationLevel = await prisma.educationLevel.update({
        where: {
            id
        },
        data
    });
    return educationLevel;
};

export const DeleteEducationLevel = async (id: string) => {
    await ensureRecordExists({ table: "educationLevel", column: "id", value: id });
    const educationLevel = await prisma.educationLevel.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return educationLevel;
};

export const GetEducationLevel = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<EducationLevel>) => {
    try {
        const members = await queryTable("educationLevel", {
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

export const GetEducationLevelById = async (id: string) => {
    const educationLevel = await prisma.educationLevel.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return educationLevel;
};
