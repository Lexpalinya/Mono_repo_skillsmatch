import { IEducationalInstitutionCreateDtoType, IEducationalInstitutionUpdateDtoType } from "@skillsmatch/dto";

import { Major } from "@prisma/client";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { QueryOptions, queryTable } from "../../utils/pagination";
import { EducationalInstitution } from "@prisma/client";

export const CreateEducationalInstitution = async (data: IEducationalInstitutionCreateDtoType) => {
    await ensureUniqueRecord({ table: "educationalInstitution", column: "name", value: data.name });
    const educationalInstitution = await prisma.educationalInstitution.create({
        data
    });
    return educationalInstitution;
};

export const UpdateEducationalInstitution = async (id: string, data: IEducationalInstitutionUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "educationalInstitution", column: "name", value: data.name });
    await ensureRecordExists({ table: "educationalInstitution", column: "id", value: id });
    const educationalInstitution = await prisma.educationalInstitution.update({
        where: {
            id
        },
        data
    });
    return educationalInstitution;
};

export const DeleteEducationalInstitution = async (id: string) => {
    await ensureRecordExists({ table: "educationalInstitution", column: "id", value: id });
    const educationalInstitution = await prisma.educationalInstitution.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return educationalInstitution;
};

export const GetEducationalInstitution = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<EducationalInstitution>) => {
    try {
        const members = await queryTable("educationalInstitution", {
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

export const GetEducationalInstitutionById = async (id: string) => {
    const educationalInstitution = await prisma.educationalInstitution.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return educationalInstitution;
};
