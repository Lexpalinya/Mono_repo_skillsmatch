import { IJobberStatusCreateDtoType, IJobberStatusUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { JobberStatus } from "@prisma/client";

export const CreateJobberStatus = async (data: IJobberStatusCreateDtoType) => {
    await ensureUniqueRecord({ table: "jobberStatus", column: "name", value: data.name });
    const jobberStatus = await prisma.jobberStatus.create({
        data
    });
    return jobberStatus;
};

export const UpdateJobberStatus = async (id: string, data: IJobberStatusUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "jobberStatus", column: "name", value: data.name });
    await ensureRecordExists({ table: "jobberStatus", column: "id", value: id });
    const jobberStatus = await prisma.jobberStatus.update({
        where: {
            id
        },
        data
    });
    return jobberStatus;
};

export const DeleteJobberStatus = async (id: string) => {
    await ensureRecordExists({ table: "jobberStatus", column: "id", value: id });
    const jobberStatus = await prisma.jobberStatus.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return jobberStatus;
};

export const GetJobberStatus = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<JobberStatus>) => {
    try {
        const members = await queryTable("jobberStatus", {
            where,
            page,
            pageSize,
            orderBy,
            include,
        });

        return members;
    } catch (error) {
        throw error;
    }
};
export const GetJobberStatusById = async (id: string) => {
    const jobberStatus = await prisma.jobberStatus.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return jobberStatus;
};
