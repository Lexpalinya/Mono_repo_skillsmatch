import {
  IPostCreateDtoType,
  IPostPaginationDtoType,
  IPostUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { queryTable } from "@utils/pagination";
import { Prisma } from "@prisma/client";
import { updateUsageCount } from "./utils/updateUsageCount";
import { formatNumberWithComma } from "@utils/format";

export const CreatePost = async (data: IPostCreateDtoType) => {
  try {
    const post = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: data.title,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          currency: data.currency,
          endDate: data.endDate,
          gpa: data.gpa,
          maxSalary: data.maxSalary,
          minSalary: data.minSalary,
          more: data.more,
          welfare: data.welfare,
          cId: data.cId,
          workday: data.workday,
          image: data.image,
        }
      });
      const postCourseData = data.courseIds?.map((item) => ({ pId: post.id, crId: item })) ?? [];
      await tx.postCourse.createMany({
        data: postCourseData
      })
      const postEducationInstitutionData = data.educationInstitutionIds?.map((item) => ({ pId: post.id, eiId: item })) ?? []
      await tx.postEducationInstitution.createMany({ data: postEducationInstitutionData })
      const postEducationLevelData = data.educationLevelIds?.map((item) => ({ pId: post.id, elId: item })) ?? []
      await tx.postEducationLevel.createMany({ data: postEducationLevelData });
      await Promise.all(
        (data.jobPositions ?? []).map(async (element) => {
          const pjpd = await tx.postJobPositionDetail.create({
            data: {
              description: element.description ?? "",
              jpId: element.jpId,
              pId: post.id,
              amount: element.amount ?? 1,
            },
          });
          const pjpdData = await element.skillIds?.map((item) => ({
            pjpId: pjpd.id,
            skId: item,
          })) ?? [];
          const a = await tx.postJobPositionDetailSkill.createMany({ data: pjpdData });
        })
      );
      await Promise.all([
        updateUsageCount({
          tx,
          relationModel: "postCourse",
          relationField: "crId",
          targetModel: "course",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postEducationInstitution",
          relationField: "eiId",
          targetModel: "educationalInstitution",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postEducationLevel",
          relationField: "elId",
          targetModel: "educationLevel",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postJobPositionDetail",
          relationField: "jpId",
          targetModel: "jobPosition",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postJobPositionDetailSkill",
          relationField: "skId",
          targetModel: "skill",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
      ]);
      return post;
    });

    return post;
  } catch (error) {
    throw error;
  }
};

export const UpdatePost = async (id: string, data: IPostUpdateDtoType) => {
  await ensureRecordExists({ table: "post", column: "id", value: id });

  const post = await prisma.$transaction(async (tx) => {

    const updatedPost = await tx.post.update({
      where: { id },
      data: {
        title: data.title,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        workday: data.workday,
        currency: data.currency,
        endDate: data.endDate,
        gpa: data.gpa,
        maxSalary: data.maxSalary,
        minSalary: data.minSalary,
        more: data.more,
        welfare: data.welfare,
        cId: data.cId,
        image: data.image,
      },
    });

    await tx.postCourse.deleteMany({ where: { pId: id } });
    await tx.postMajor.deleteMany({ where: { pId: id } });
    await tx.postEducationLevel.deleteMany({ where: { pId: id } });
    await tx.postEducationInstitution.deleteMany({ where: { pId: id } });

    const oldJobDetails = await tx.postJobPositionDetail.findMany({
      where: { pId: id },
    });
    const jobDetailIds = oldJobDetails.map((item) => item.id);

    await tx.postJobPositionDetailSkill.deleteMany({
      where: { pjpId: { in: jobDetailIds } },
    });
    await tx.postJobPositionDetail.deleteMany({ where: { pId: id } });

    if (data.courseIds?.length) {
      await tx.postCourse.createMany({
        data: data.courseIds.map((crId) => ({ pId: id, crId })),
      });
    }

    if (data.majorIds?.length) {
      await tx.postMajor.createMany({
        data: data.majorIds.map((mId) => ({ pId: id, mId })),
      });
    }

    if (data.educationLevelIds?.length) {
      await tx.postEducationLevel.createMany({
        data: data.educationLevelIds.map((elId) => ({ pId: id, elId })),
      });
    }

    if (data.educationInstitutionIds?.length) {
      await tx.postEducationInstitution.createMany({
        data: data.educationInstitutionIds.map((eiId) => ({ pId: id, eiId })),
      });
    }

    for (const jp of data.jobPositions ?? []) {
      if (!jp.jpId) {
        continue;
      }
      const pjpd = await tx.postJobPositionDetail.create({
        data: {
          pId: id,
          jpId: jp.jpId,
          description: jp.description ?? "",
          amount: jp.amount ?? 1,
        },
      });

      if (jp.skillIds?.length) {
        await tx.postJobPositionDetailSkill.createMany({
          data: jp.skillIds.map((skId) => ({ pjpId: pjpd.id, skId })),
        });
      }
    }

    await Promise.all([
      updateUsageCount({
        tx,
        relationModel: "postCourse",
        relationField: "crId",
        targetModel: "course",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
      updateUsageCount({
        tx,
        relationModel: "postMajor",
        relationField: "mId",
        targetModel: "major",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
      updateUsageCount({
        tx,
        relationModel: "postEducationLevel",
        relationField: "elId",
        targetModel: "educationLevel",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
      updateUsageCount({
        tx,
        relationModel: "postEducationInstitution",
        relationField: "eiId",
        targetModel: "educationalInstitution",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
      updateUsageCount({
        tx,
        relationModel: "postJobPositionDetail",
        relationField: "jpId",
        targetModel: "jobPosition",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
      updateUsageCount({
        tx,
        relationModel: "postJobPositionDetailSkill",
        relationField: "skId",
        targetModel: "skill",
        targetIdField: "id",
        targetCountField: "postUsageCount",
      }),
    ]);

    return updatedPost;
  });

  return post;
};

export const DeletePost = async (id: string) => {
  await ensureRecordExists({ table: "post", column: "id", value: id });
  const post = await prisma.$transaction(
    async (tx) => {
      await tx.post.update({
        where: { id },
        data: { isActive: false },
      })
      await tx.postCourse.deleteMany({ where: { pId: id } });
      await tx.postMajor.deleteMany({ where: { pId: id } });
      await tx.postEducationLevel.deleteMany({ where: { pId: id } });
      await tx.postEducationInstitution.deleteMany({ where: { pId: id } });
      const oldJobDetails = await tx.postJobPositionDetail.findMany({
        where: { pId: id },
      });
      const jobDetailIds = oldJobDetails.map((item) => item.id);

      await tx.postJobPositionDetailSkill.deleteMany({
        where: { pjpId: { in: jobDetailIds } },
      });
      await tx.postJobPositionDetail.deleteMany({ where: { pId: id } });
      await Promise.all([
        updateUsageCount({
          tx,
          relationModel: "postCourse",
          relationField: "crId",
          targetModel: "course",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postMajor",
          relationField: "mId",
          targetModel: "major",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postEducationLevel",
          relationField: "elId",
          targetModel: "educationLevel",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postEducationInstitution",
          relationField: "eiId",
          targetModel: "educationalInstitution",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postJobPositionDetail",
          relationField: "jpId",
          targetModel: "jobPosition",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
        updateUsageCount({
          tx,
          relationModel: "postJobPositionDetailSkill",
          relationField: "skId",
          targetModel: "skill",
          targetIdField: "id",
          targetCountField: "postUsageCount",
        }),
      ]);
    }

  )
  return post;
};

export const GetPost = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  startDate,
  endDate
}: IPostPaginationDtoType) => {
  try {
    let where: Prisma.PostWhereInput = { isActive: true };
    if (search) {
      where = {
        ...where,
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
    }

    if (startDate || endDate) {
      where = {
        ...where,
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && {
            lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
          }),
        },
      };
    }

    const select: Prisma.PostSelect = {
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
          isActive: true,
          province: true,
          district: true,
          village: true,
          member: {
            select: {
              id: true,
              profile: true
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
    };

    const items = await queryTable("post", {
      page,
      limit,
      where,
      select,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    console.log('items :>> ', items);
    return items;
  } catch (error) {
    console.error("Error occurred while fetching post statistics:", error);
    throw error; // Rethrow the error after logging
  }
};
export const GetMostPostion = async ({
  page = 1,
  limit = 10,
  search,
  sortOrder = "asc",
  sortBy,
  startDate,
  endDate
}: IPostPaginationDtoType) => {
  try {
    let where: Prisma.PostWhereInput = { isActive: true };

    if (search) {
      where = {
        ...where,
        OR: [
          {
            title: { contains: search, mode: "insensitive" },
          },
          {
            company: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && {
          lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
        }),
      };
    }

    const posts = await prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        postJobPositionDetail: {
          select: {
            amount: true,
            jp: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });


    const positionCountMap = new Map<string, { name: string; totalAmount: number }>();

    for (const post of posts) {
      for (const detail of post.postJobPositionDetail) {
        const { id, name } = detail.jp;
        const current = positionCountMap.get(id);

        positionCountMap.set(id, {
          name,
          totalAmount: (current?.totalAmount || 0) + detail.amount,
        });
      }
    }

    const topPositions = Array.from(positionCountMap.entries())
      .map(([jpId, { name, totalAmount }]) => ({ jpId, name, totalAmount }))
      .sort((a, b) =>
        sortBy === "totalAmount"
          ? sortOrder === "asc"
            ? a.totalAmount - b.totalAmount
            : b.totalAmount - a.totalAmount
          : 0
      );

    return topPositions;


    return topPositions;
  } catch (error) {
    console.error("Error occurred while calculating top positions:", error);
    throw error;
  }
};

export const GetPostById = async (id: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },

    include: {
      company: {
        select: {
          name: true,
          province: true,
          district: true,
          village: true,
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
      postCourse: {
        select: {
          cr: {
            select: { name: true }
          }
        }
      },
      postMajor: {
        select: {
          major: {
            select: {
              name: true
            }
          }
        }
      },
      postEducationLevel: {
        select: {
          educationLevel: {
            select: {
              name: true
            }
          }
        }
      },
      postEducationInstitution: {
        select: {
          ei: {
            select: {
              name: true
            }
          }
        }
      },
      postJobPositionDetail: {
        select: {
          jp: {
            select: {
              name: true
            }
          },
          amount: true,
          description: true,
          postJobPositionDetailSkill: {
            select: {
              sk: {
                select: {
                  name: true
                }
              }
            }
          }

        }
      },
    },
  });
  const result = {
    id: post.id,
    title: post.title,
    company: post.company,
    imageUrls: post.image,
    workDay: post.workday,
    minSalary: formatNumberWithComma(Number(post.minSalary ?? 0)),
    maxSalary: formatNumberWithComma(Number(post.maxSalary)),
    currency: post.currency,
    workTime: `${post.checkInTime} - ${post.checkOutTime}`,
    gpa: post.gpa,
    endDate: new Date(post.endDate).toLocaleDateString("th-TH"),
    welfare: post.welfare,
    more: post.more,
    educationLevels: post.postEducationLevel.map(e => e.educationLevel.name),
    institutions: post.postEducationInstitution.map(i => i.ei.name),
    majors: post.postMajor.map(m => m.major.name),
    courses: post.postCourse.map(c => c.cr.name),
    jobPositions: post.postJobPositionDetail.map(pos => ({
      name: pos.jp.name,
      amount: pos.amount,
      description: pos.description,
      skills: pos.postJobPositionDetailSkill.map(s => s.sk.name)
    })),
  };
  console.log('result :>> ', result);

  return result;
};
export const GetStatsPost = async () => {
  try {
    const [
      totalPosts,
      activePosts,
      uniqueCompanies,
      totalPositions,
      expiredPosts,
      averageSalaryResult,
      averageGPAResult,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isActive: true } }),
      prisma.company.count({ where: { isActive: true } }),
      prisma.jobPosition.count({ where: { isActive: true } }),
      prisma.post.count({ where: { isActive: false } }),
      prisma.post.aggregate({
        _avg: {
          maxSalary: true,
          minSalary: true,
        },
        where: { isActive: true },
      }),
      prisma.post.aggregate({
        _avg: {
          gpa: true,
        },
        where: { isActive: true },
      }),
    ]);

    const minSalary = averageSalaryResult._avg.minSalary ?? 0;
    const maxSalary = averageSalaryResult._avg.maxSalary ?? 0;

    const averageSalary = (Number(minSalary) + Number(maxSalary)) / 2;
    const averageGPA = averageGPAResult._avg.gpa ?? 0;

    const activePercentage = totalPosts
      ? Math.round((activePosts / totalPosts) * 100)
      : 0;

    return {
      totalPosts,
      activePosts,
      activePercentage,
      uniqueCompanies,
      totalPositions,
      averageSalary: Number(averageSalary.toFixed(2)),
      averageGPA: Number(averageGPA.toFixed(2)),
      expiredPosts,
    };
  } catch (error) {
    throw error;
  }
};

export const GetPostUpdate = async (id: string) => {
  console.log('id :>> ', id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      postCourse: true,
      postMajor: true,
      postEducationLevel: true,
      postEducationInstitution: true,
      postJobPositionDetail: {
        include: {
          postJobPositionDetailSkill: true,
        },
      },
    },
  });

  if (!post) throw new Error("Post not found");

  return {
    cId: post.cId,
    title: post.title,
    image: post.image,
    minSalary: Number(post.minSalary),
    maxSalary: Number(post.maxSalary),
    checkInTime: post.checkInTime,
    checkOutTime: post.checkOutTime,
    gpa: post.gpa,
    currency: post.currency,
    workday: post.workday,
    endDate: post.endDate,
    welfare: post.welfare,
    more: post.more,
    courseIds: post.postCourse.map((pc) => pc.crId),
    majorIds: post.postMajor.map((pm) => pm.mId),
    educationLevelIds: post.postEducationLevel.map((pel) => pel.elId),
    educationInstitutionIds: post.postEducationInstitution.map((pei) => pei.eiId),
    jobPositions: post.postJobPositionDetail.map((jp) => ({
      id: jp.id,
      jpId: jp.jpId,
      description: jp.description,
      amount: jp.amount,
      skillIds: jp.postJobPositionDetailSkill.map((sk) => sk.skId),
    })),
  };
};


export const GetPostByCompanyId = async (id: string) => {
  try {
    let where: Prisma.PostWhereInput = { isActive: true, cId: id };
    const select: Prisma.PostSelect = {
      id: true,
      title: true,
      cId: true,
      minSalary: true,
      maxSalary: true,
      endDate: true,
      company: {
        select: {
          name: true,
          province: true,
          district: true,
          village: true,
          member: {
            select: {
              id: true,
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
          id: true,
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


    };

    const items = await queryTable("post", {
      limit: 1000,
      where,
      select,
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log('items.data :>> ', items.data);

    return items.data;
  } catch (error) {
    console.error("Error occurred while fetching post by company ID:", error);
    throw error; // Rethrow the error after logging

  }
}

export const GetPosts = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
}: IPostPaginationDtoType) => {
  try {
    let where: Prisma.PostWhereInput = { isActive: true };
    if (search) {
      where = {
        ...where,
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
    }

    const select: Prisma.PostSelect = {
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
      isActive: true,
      company: {
        select: {
          name: true,
          province: true,
          district: true,
          village: true,
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
    };

    const items = await queryTable("post", {
      page,
      limit,
      where,
      select,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    console.log('items :>> ', items);

    return items;


  } catch (error) {
    console.error("Error occurred while fetching post statistics:", error);
    throw error; // Rethrow the error after logging

  }
}
