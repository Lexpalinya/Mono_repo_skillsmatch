// utils/updateAllUsageCounts.ts
import { Prisma } from "@prisma/client";
import { updateUsageCount } from "./updateUsageCount";

type Input = {
    tx: Prisma.TransactionClient;
    elId: string;
    eiId: string;
    mId: string;
    cId: string;
};

export async function updateAllUsageCountsForJobberProfile({
    tx,
    elId,
    eiId,
    mId,
    cId,
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
    ]);
}
