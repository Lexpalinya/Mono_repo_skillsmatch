import { Prisma, PrismaClient } from "@prisma/client";

type UpdateUsageCountParams = {
    tx: Prisma.TransactionClient;
    relationModel: keyof Prisma.TransactionClient;
    relationField: string;
    targetModel: keyof Prisma.TransactionClient;
    targetIdField: string;
    targetCountField: string;
};

export async function updateUsageCount({
    tx,
    relationModel,
    relationField,
    targetModel,
    targetIdField,
    targetCountField,
}: UpdateUsageCountParams) {
    const grouped = await (tx[relationModel] as any).groupBy({
        by: [relationField],
        _count: { [relationField]: true },
    });

    await Promise.all(
        grouped.map((item: any) =>
            (tx[targetModel] as any).update({
                where: { [targetIdField]: item[relationField] },
                data: { [targetCountField]: item._count[relationField] },
            })
        )
    );
}
