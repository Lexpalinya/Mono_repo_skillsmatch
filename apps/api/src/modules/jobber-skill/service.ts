import prisma from "@lib/prisma-client";
import { Prisma, } from "@prisma/client";
import { IJobberSkillDtoCreateType, IJobberSkillDeleteDtoType } from "@skillsmatch/dto";


const updateSkillUsageCount = async (sId: string, tx: Prisma.TransactionClient) => {
    const count = await tx.jobberSkill.count({
        where: { sId },
    });

    await tx.skill.update({
        where: { id: sId },
        data: { jobberUsageCount: count },
    });
};

export const createOrReplaceJobberSkills = async (input: IJobberSkillDtoCreateType) => {
    await prisma.$transaction(async (tx) => {

        const oldSkills = await tx.jobberSkill.findMany({
            where: { jId: input.jId },
            select: { sId: true },
        });

        const oldSkillIds = oldSkills.map((s) => s.sId);


        await tx.jobberSkill.deleteMany({
            where: { jId: input.jId },
        });


        const createManyData = input.sIds.map((sId) => ({
            jId: input.jId,
            sId,
        }));

        await tx.jobberSkill.createMany({ data: createManyData });


        const affectedSkillIds = Array.from(new Set([...oldSkillIds, ...input.sIds]));
        await Promise.all(affectedSkillIds.map((sId) => updateSkillUsageCount(sId, tx)));
    });
};

export const deleteJobberSkill = async (input: IJobberSkillDeleteDtoType) => {
    await prisma.$transaction(async (tx) => {
        await tx.jobberSkill.delete({
            where: {
                jId_sId: {
                    jId: input.jId,
                    sId: input.sId,
                },
            },
        });

        await updateSkillUsageCount(input.sId, tx);
    });
};

export const getJobberSkills = async (jId: string) => {
    return prisma.jobberSkill.findMany({
        where: { jId },
        include: {
            skill: true,
        },
    });
};
