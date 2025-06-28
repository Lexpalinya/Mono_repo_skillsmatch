// utils/updateUsageCount.ts
import { Prisma } from "@prisma/client";

type UsageCountConfig = {
    tx: Prisma.TransactionClient;
    model: keyof Prisma.TransactionClient;
    countField: string;
    jobberProfileField: keyof Prisma.JobberProfileWhereInput;
    foreignKeyId: string;
};

export async function updateUsageCount({
    tx,
    model,
    countField,
    jobberProfileField,
    foreignKeyId,
}: UsageCountConfig) {
    const count = await tx.jobberProfile.count({
        where: {
            [jobberProfileField]: foreignKeyId,
        },
    });

    await (tx[model] as any).update({
        where: { id: foreignKeyId },
        data: {
            [countField]: count,
        },
    });
}



type UpdateUsagesCountParams = {
    tx: Prisma.TransactionClient;
    relationModel: string;
    relationField: string;
    targetModel: string;
    targetIdField: string;
    targetCountField: string;
    previousIds: string[];
    currentIds: string[];
};

export async function updateUsagesCount({
    tx,
    relationModel,
    relationField,
    targetModel,
    targetIdField,
    targetCountField,
    previousIds,
    currentIds,
}: UpdateUsagesCountParams) {

    const allIds = Array.from(new Set([...previousIds, ...currentIds]));

    for (const id of allIds) {
        const count = await (tx[relationModel as keyof Prisma.TransactionClient] as any).count({
            where: { [relationField]: id },
        });

        await (tx[targetModel as keyof Prisma.TransactionClient] as any).update({
            where: { [targetIdField]: id },
            data: { [targetCountField]: count },
        });
    }
}
