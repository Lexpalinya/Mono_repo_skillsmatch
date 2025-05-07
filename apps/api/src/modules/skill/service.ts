import { ISkillCreateDtoType, ISkillUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Skill } from "@prisma/client";

export const CreateSkill = async (data: ISkillCreateDtoType) => {
    await ensureUniqueRecord({ table: "skill", column: "name", value: data.name });
    const skill = await prisma.skill.create({
        data
    });
    return skill;
};

export const UpdateSkill = async (id: string, data: ISkillUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "skill", column: "name", value: data.name });
    await ensureRecordExists({ table: "skill", column: "id", value: id });
    const skill = await prisma.skill.update({
        where: {
            id
        },
        data
    });
    return skill;
};

export const DeleteSkill = async (id: string) => {
    await ensureRecordExists({ table: "skill", column: "id", value: id });
    const skill = await prisma.skill.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return skill;
};

export const GetSkill = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Skill>) => {
    try {
        const members = await queryTable("skill", {
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

export const GetSkillById = async (id: string) => {
    const skill = await prisma.skill.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return skill;
};
