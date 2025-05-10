import { IJobberCreateDtoType, IJobberUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Jobber } from "@prisma/client";

export const CreateJobber = async (data: IJobberCreateDtoType) => {
    await ensureUniqueRecord({ table: "jobber", column: "memberId", value: data.memberId });

    const jobber = await prisma.jobber.create({
        data,
    });

    return jobber;
};

export const UpdateJobber = async (id: string, data: IJobberUpdateDtoType) => {
    if (data.memberId) {
        await ensureUniqueRecord({ table: "jobber", column: "memberId", value: data.memberId });
    }

    await ensureRecordExists({ table: "jobber", column: "id", value: id });

    const jobber = await prisma.jobber.update({
        where: { id },
        data,
    });

    return jobber;
};

export const DeleteJobber = async (id: string) => {
    await ensureRecordExists({ table: "jobber", column: "id", value: id });

    const jobber = await prisma.jobber.update({
        where: { id },
        data: { isActive: false },
    });

    return jobber;
};

export const GetJobber = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Jobber>) => {
    return queryTable("jobber", {
        where,
        page,
        pageSize,
        orderBy,
        include,
    });
};

export const GetJobberById = async (id: string) => {
    const jobber = await prisma.jobber.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
    });

    return jobber;
};
