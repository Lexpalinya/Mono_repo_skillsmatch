
import { IApplyForJobCreateDTOType, IApplyForJobUpdateDTOType } from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";


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

export const GetApplyForJobById = async (id: string) => {
    const apply = await prisma.applyForJob.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
    });

    return apply;
};

export const GetApplyForJobberByJobberId = async (id: string) => {
    try {
        const apply = await prisma.applyForJob.findMany({
            where: {
                jId: id,
                isActive: true
            },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                        gpa: true,
                        workday: true,
                        currency: true,
                        minSalary: true,
                        maxSalary: true,
                        checkInTime: true,
                        checkOutTime: true,
                        endDate: true,
                        createdAt: true,
                        isActive: true,
                        company: {
                            select: {
                                name: true,
                                province: true,
                                district: true,
                                village: true,
                                isVerify: true,
                                member: {
                                    select: {
                                        profile: true
                                    }
                                },
                                bm: {
                                    select: {
                                        name: true
                                    }
                                }
                            },
                        },
                        postJobPositionDetail: {
                            select: {
                                jp: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                postJobPositionDetailSkill: {
                                    select: {
                                        sk: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            }

        })
        console.log('apply[0] :>> ', apply[0]);
        return apply
    } catch (error) {
        console.log('error :>> ', error);
    }
}