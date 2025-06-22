
import { Prisma } from "@prisma/client";

type UsageCountConfig = {
    tx: Prisma.TransactionClient;
    model: keyof Prisma.TransactionClient;
    countField: string;
    jobberField: keyof Prisma.JobberWhereInput;
    foreignKeyId: string;
};

export async function updateUsageCount({
    tx,
    model,
    countField,
    jobberField,
    foreignKeyId,
}: UsageCountConfig) {
    const count = await tx.jobber.count({
        where: {
            [jobberField]: foreignKeyId,
        },
    });

    await (tx[model] as any).update({
        where: { id: foreignKeyId },
        data: {
            [countField]: count,
        },
    });
}