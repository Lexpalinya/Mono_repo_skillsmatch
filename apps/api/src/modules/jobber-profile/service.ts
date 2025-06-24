import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";

import { IJobberProfileCreateDtoType, IJobberProfileUpdateDtoType } from "@skillsmatch/dto";

import { syncAllUsageCountsForJobberProfile } from "./utils/syncUsageCounts";


export const CreateJobberProfile = async (data: IJobberProfileCreateDtoType) => {
    await ensureUniqueRecord({ column: "jId", table: "jobberProfile", value: data.jId, where: {} })
    await ensureRecordExists({ table: "educationLevel", column: "id", value: data.elId, })
    await ensureRecordExists({ table: "educationalInstitution", column: "id", value: data.eiId })
    await ensureRecordExists({ table: "major", column: "id", value: data.mId })
    await ensureRecordExists({ table: "course", column: "id", value: data.cId })
    return await prisma.$transaction(async (tx) => {

        const profile = await tx.jobberProfile.create({
            data: {
                ...data,
                mId: data.mId,
                cId: data.cId,
                eiId: data.eiId,
                elId: data.elId

            }
        });


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
    try {

        if (data.cId)
            await ensureRecordExists({ table: "course", column: "id", value: data.cId })
        if (data.eiId)
            await ensureRecordExists({ table: "educationalInstitution", column: "id", value: data.eiId })
        if (data.elId) await ensureRecordExists({ table: "educationLevel", column: "id", value: data.elId })
        if (data.mId) await ensureRecordExists({ table: "major", column: "id", value: data.mId })
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
    } catch (error) {
        console.log('error', error)
    }
};




export const GetJobberProfileByJobberId = async (id: string) => {
    try {

        const jobberProfile = await prisma.jobberProfile.findFirst({
            where: { jId: id },
        });
        console.log('jobberProfile', jobberProfile)
        return jobberProfile;
    } catch (error) {
        console.log('error', error)
    }
};

