import {
  IApplyForJobCreateDTOType,
  IApplyForJobUpdateDTOType,
} from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";

export const CreateApplyForJob = async (data: IApplyForJobCreateDTOType) => {
  const apply = await prisma.applyForJob.create({
    data,
  });
  return apply;
};

export const UpdateApplyForJob = async (
  id: string,
  data: IApplyForJobUpdateDTOType
) => {
  console.log("data :>> ", data);
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
        isActive: true,
      },
      orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
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
                    profile: true,
                  },
                },
                bm: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            postJobPositionDetail: {
              select: {
                amount: true,
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
          },
        },
      },
    });

    return apply;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const GetApplyForCompanyId = async (id: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isActive: true,
        cId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
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
                profile: true,
              },
            },
            bm: {
              select: {
                name: true,
              },
            },
          },
        },
        postJobPositionDetail: {
          select: {
            amount: true,
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
        ApplyForJob: {
          where: {
            isActive: true,
          },
          include: {
            jobber: {
              include: {
                member: {
                  select: {
                    id: true,
                    username: true,
                    phoneNumber: true,
                    email: true,
                    profile: true,
                    background: true,
                  },
                },
                status: {
                  select: {
                    name: true,
                  },
                },
                JobberProfile: {
                  include: {
                    major: {
                      select: {
                        name: true,
                      },
                    },
                    course: {
                      select: {
                        name: true,
                      },
                    },
                    educationalInstitutions: {
                      select: {
                        name: true,
                      },
                    },
                    educationLevels: {
                      select: {
                        name: true,
                      },
                    },
                    JobberProfileSkill: {
                      select: {
                        skill: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                    JobberProfilePosition: {
                      select: {
                        jP: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("GetApplyForCompanyId error: ", error);
    throw error;
  }
};
