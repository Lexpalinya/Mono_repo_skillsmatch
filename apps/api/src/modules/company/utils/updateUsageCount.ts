
import { Prisma } from "@prisma/client";

type UsageCountConfig = {
    tx: Prisma.TransactionClient;
    model: keyof Prisma.TransactionClient;
    countField: string;
    companyField: keyof Prisma.CompanyWhereInput;
    foreignKeyId: string;
};

export async function updateUsageCount({
    tx,
    model,
    countField,
    companyField,
    foreignKeyId,
}: UsageCountConfig) {
    const count = await tx.company.count({
        where: {
            [companyField]: foreignKeyId,
        },
    });

    await (tx[model] as any).update({
        where: { id: foreignKeyId },
        data: {
            [countField]: count,
        },
    });
}