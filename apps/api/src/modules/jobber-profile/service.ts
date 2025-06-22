import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";

import { IJobberProfileCreateDtoType, IJobberProfileUpdateDtoType } from "@skillsmatch/dto";

import { syncAllUsageCountsForJobberProfile } from "./utils/syncUsageCounts";


export const CreateJobberProfile = async (data: IJobberProfileCreateDtoType) => {
    await ensureUniqueRecord({ column: "jId", table: "jobberProfile", value: data.jId })
    await ensureRecordExists({ table: "educationLevel", column: "elId", value: data.elId })
    await ensureRecordExists({ table: "educationalInstitution", column: "eiId", value: data.eiId })
    await ensureRecordExists({ table: "major", column: "mId", value: data.mId })
    await ensureRecordExists({ table: "course", column: "cId", value: data.cId })
    return await prisma.$transaction(async (tx) => {
        const profile = await tx.jobberProfile.create({ data });


        await syncAllUsageCountsForJobberProfile({
            tx,
            oldData: {},
            newData: {
                elId: data.elId,
                eiId: data.eiId,
                mId: data.mId,
                cId: data.cId,
            },
        });
        return profile;
    });
};

export const UpdateJobberProfile = async (
    id: string,
    data: IJobberProfileUpdateDtoType
) => {
    if (data.cId)
        await ensureRecordExists({ table: "course", column: "cId", value: data.cId })
    if (data.eiId)
        await ensureRecordExists({ table: "educationalInstitution", column: "eiId", value: data.eiId })
    if (data.elId) await ensureRecordExists({ table: "educationLevel", column: "elId", value: data.elId })
    if (data.mId) await ensureRecordExists({ table: "major", column: "mId", value: data.mId })
    return await prisma.$transaction(async (tx) => {
        const old = await tx.jobberProfile.findUniqueOrThrow({
            where: { id },
            select: {
                elId: true,
                eiId: true,
                mId: true,
                cId: true,
            },
        });

        const updated = await tx.jobberProfile.update({
            where: { id },
            data,
        });

        await syncAllUsageCountsForJobberProfile({
            tx,
            oldData: old,
            newData: {
                elId: data.elId ?? old.elId,
                eiId: data.eiId ?? old.eiId,
                mId: data.mId ?? old.mId,
                cId: data.cId ?? old.cId,
            },
        });

        return updated;
    });
};




export const GetJobberProfileByJobberId = async (id: string) => {
    const jobberProfile = await prisma.jobberProfile.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            jId: true,
            gpa: true,
            drivingCardType: true,
            more: true,
            startSalary: true,
            currency: true,
            workDay: true,
            checkInTime: true,
            checkOutTime: true,
            createdAt: true,
            updatedAt: true,
            jobber: true,
            course: true,
            major: true,
            educationLevels: true,
            eductaionalInstitutions: true,
        },
    });
    return jobberProfile;
};

