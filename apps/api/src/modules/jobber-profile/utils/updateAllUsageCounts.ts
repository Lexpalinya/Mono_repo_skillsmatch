// utils/updateAllUsageCounts.ts
import { Prisma } from "@prisma/client";
import { updateUsageCount, updateUsagesCount } from "./updateUsageCount";

type Input = {
    tx: Prisma.TransactionClient;
    elId: string;
    eiId: string;
    mId: string;
    cId: string;
    skillIds: string[];
    jobPositionIds: string[]
};

export async function updateAllUsageCountsForJobberProfile({
    tx,
    elId,
    eiId,
    mId,
    cId,
    skillIds,
    jobPositionIds
}: Input) {
    await Promise.all([
        updateUsageCount({
            tx,
            model: "educationLevel",
            countField: "jobberUsageCount",
            jobberProfileField: "elId",
            foreignKeyId: elId,
        }),
        updateUsageCount({
            tx,
            model: "educationalInstitution",
            countField: "jobberUsageCount",
            jobberProfileField: "eiId",
            foreignKeyId: eiId,
        }),
        updateUsageCount({
            tx,
            model: "major",
            countField: "jobberUsageCount",
            jobberProfileField: "mId",
            foreignKeyId: mId,
        }),
        updateUsageCount({
            tx,
            model: "course",
            countField: "jobberUsageCount",
            jobberProfileField: "cId",
            foreignKeyId: cId,
        }),
        await updateUsagesCount({
            tx,
            relationModel: "jobberProfileSkill",
            relationField: "sId",
            targetModel: "skill",
            targetIdField: "id",
            targetCountField: "jobberUsageCount",
            previousIds: [],
            currentIds: skillIds ?? []
        }),

        await updateUsagesCount({
            tx,
            relationModel: "jobberProfilePosition",
            relationField: "jPId",
            targetModel: "jobPosition",
            targetIdField: "id",
            targetCountField: "jobberUsageCount",
            previousIds: [],
            currentIds: jobPositionIds ?? [],
        })


    ]);
}

