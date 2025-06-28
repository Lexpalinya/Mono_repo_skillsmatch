// utils/syncUsageCounts.ts
import { Prisma } from "@prisma/client";
import { updateUsageCount } from "./updateUsageCount";

const FIELD_MODEL_MAP = {
    elId: "educationLevel",
    eiId: "educationalInstitution",
    mId: "major",
    cId: "course",
} as const;

type FieldKey = keyof typeof FIELD_MODEL_MAP;

export async function syncAllUsageCountsForJobberProfile({
    tx,
    oldData,
    newData,
}: {
    tx: Prisma.TransactionClient;
    oldData: Partial<Record<FieldKey, string>>;
    newData: Partial<Record<FieldKey, string>>;
}) {
    const fields: FieldKey[] = ["elId", "eiId", "mId", "cId"];

    await Promise.all(
        fields.flatMap((field) => {
            const model = FIELD_MODEL_MAP[field];
            const updates = new Set<string>();

            if (oldData[field] && oldData[field] !== newData[field]) {
                updates.add(oldData[field]!);
            }

            if (newData[field]) {
                updates.add(newData[field]!);
            }

            return Array.from(updates).map((id) =>
                updateUsageCount({
                    tx,
                    model: model as keyof Prisma.TransactionClient,
                    countField: "jobberUsageCount",
                    jobberProfileField: field,
                    foreignKeyId: id,
                })
            );
        })
    );
}
