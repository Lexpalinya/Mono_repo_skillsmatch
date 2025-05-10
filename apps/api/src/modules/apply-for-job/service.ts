
import { IApplyForJobCreateDTOType, IApplyForJobUpdateDTOType } from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { ApplyForJob } from "@prisma/client";

export const CreateApplyForJob = async (data: IApplyForJobCreateDTOType) => {
    const apply = await prisma.applyForJob.create({
        data,
    });
    return apply;
};

export const UpdateApplyForJob = async (id: string, data: IApplyForJobUpdateDTOType) => {
    await ensureRecordExists({ table: "applyForJob", column: "id", value: id });

    const apply = await prisma.applyForJob.update({
        where: { id },
        data,
    });

    return apply;
};

export const DeleteApplyForJob = async (id: string) => {
    await ensureRecordExists({ table: "applyForJob", column: "id", value: id });

    const apply = await prisma.applyForJob.update({
        where: { id },
        data: { isActive: false },
    });

    return apply;
};

export const GetApplyForJob = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<ApplyForJob>) => {
    return queryTable("applyForJob", {
        where,
        page,
        pageSize,
        orderBy,
        include,
    });
};

export const GetApplyForJobById = async (id: string) => {
    const apply = await prisma.applyForJob.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
    });

    return apply;
};
