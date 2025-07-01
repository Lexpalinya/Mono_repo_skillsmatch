import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";

import { IJobberProfileCreateDtoType, IJobberProfileUpdateDtoType } from "@skillsmatch/dto";

import { syncAllUsageCountsForJobberProfile } from "./utils/syncUsageCounts";
import { updateUsagesCount } from "./utils/updateUsageCount";


export const CreateJobberProfile = async (data: IJobberProfileCreateDtoType) => {
    await ensureUniqueRecord({ column: "jId", table: "jobberProfile", value: data.jId, where: {} })
    await ensureRecordExists({ table: "educationLevel", column: "id", value: data.elId, })
    await ensureRecordExists({ table: "educationalInstitution", column: "id", value: data.eiId })
    await ensureRecordExists({ table: "major", column: "id", value: data.mId })
    await ensureRecordExists({ table: "course", column: "id", value: data.cId })
    console.log('data.cv :>> ', data.cv);
    return await prisma.$transaction(async (tx) => {

        const profile = await tx.jobberProfile.create({
            data: {
                jId: data.jId,
                elId: data.elId,
                eiId: data.eiId,
                mId: data.mId,
                cId: data.cId,
                gpa: data.gpa,
                cv: data.cv ?? [],
                startSalary: data.startSalary,
                currency: data.currency,
                workDay: data.workDay,
                checkInTime: data.checkInTime,
                checkOutTime: data.checkOutTime,
            }
        });
        const profilePosition = data.jobPositionIds?.map((item) => ({ jpId: profile.id, jPId: item })) ?? [];
        await tx.jobberProfilePosition.createMany({
            data: profilePosition
        })
        const profileSkill = await data.skillIds?.map((item) => ({
            jpId: profile.id,
            sId: item,
        })) ?? [];
        await tx.jobberProfileSkill.createMany({ data: profileSkill });

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
            await ensureRecordExists({ table: "course", column: "id", value: data.cId });
        if (data.eiId)
            await ensureRecordExists({ table: "educationalInstitution", column: "id", value: data.eiId });
        if (data.elId)
            await ensureRecordExists({ table: "educationLevel", column: "id", value: data.elId });
        if (data.mId)
            await ensureRecordExists({ table: "major", column: "id", value: data.mId });
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
                data: {
                    jId: data.jId,
                    elId: data.elId,
                    eiId: data.eiId,
                    mId: data.mId,
                    cId: data.cId, cv: data.cv ?? [],
                    gpa: data.gpa,
                    startSalary: data.startSalary,
                    currency: data.currency,
                    workDay: data.workDay,
                    checkInTime: data.checkInTime,
                    checkOutTime: data.checkOutTime,
                },
            });
            const oldSkills = await tx.jobberProfileSkill.findMany({
                where: { jpId: id },
                select: { sId: true },
            });
            const oldPositions = await tx.jobberProfilePosition.findMany({
                where: { jpId: id },
                select: { jPId: true },
            });

            await tx.jobberProfileSkill.deleteMany({ where: { jpId: id } });
            await tx.jobberProfilePosition.deleteMany({ where: { jpId: id } });

            if (data.skillIds) {
                const profileSkills = data.skillIds.map((item) => ({
                    jpId: id,
                    sId: item,
                }));
                await tx.jobberProfileSkill.createMany({ data: profileSkills });
            }

            if (data.jobPositionIds) {
                const profilePositions = data.jobPositionIds.map((item) => ({
                    jpId: id,
                    jPId: item,
                }));
                await tx.jobberProfilePosition.createMany({ data: profilePositions });
            }
            await updateUsagesCount({
                tx,
                relationModel: "jobberProfileSkill",
                relationField: "sId",
                targetModel: "skill",
                targetIdField: "id",
                targetCountField: "jobberUsageCount",
                previousIds: oldSkills.map((s) => s.sId),
                currentIds: data.skillIds ?? [],
            });

            await updateUsagesCount({
                tx,
                relationModel: "jobberProfilePosition",
                relationField: "jPId",
                targetModel: "jobPosition",
                targetIdField: "id",
                targetCountField: "jobberUsageCount",
                previousIds: oldPositions.map((p) => p.jPId),
                currentIds: data.jobPositionIds ?? [],
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
        console.error("UpdateJobberProfile error:", error);
        throw error;
    }
};

export const GetJobberProfileByJobberId = async (id: string) => {
    try {

        const jobberProfile = await prisma.jobberProfile.findFirst({
            where: { jId: id },
            include: {
                JobberProfilePosition: true,
                JobberProfileSkill: true

            }
        });

        const result = {
            ...jobberProfile,
            jobPositionIds: jobberProfile?.JobberProfilePosition.map((item) => item.jPId),
            skillIds: jobberProfile?.JobberProfileSkill.map((item) => item.sId)
        }
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.log('error', error)
    }
};
