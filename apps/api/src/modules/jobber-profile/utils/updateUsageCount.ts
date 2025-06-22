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