import {
  IPostCreateDtoType,
  IPostPaginationDtoType,
  IPostUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { queryTable } from "@utils/pagination";
import { Prisma } from "@prisma/client";
import { pickMatchingFields } from "@utils/pickMatchingFields";
export const CreatePost = async (data: IPostCreateDtoType) => {
  try {

    const post = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: data.title,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkInTime,
          currency: data.currency,
          endDate: data.endDate,
          gpa: data.gpa,
          maxSalary: data.maxSalary,
          minSalary: data.minSalary,
          more: data.more,
          welfare: data.welfare,
          cId: data.cId,
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
          console.log('pjpd :>> ', pjpd);

          const pjpdData = await element.skillIds?.map((item) => ({
            pjpId: pjpd.id,
            skId: item,
          })) ?? [];
          console.log('pjpdData :>> ', pjpdData);

          const a = await tx.postJobPositionDetailSkill.createMany({ data: pjpdData });
          console.log('a :>> ', a);
        })
      );


      return post;
    });

    return post;
  } catch (error) {
    console.log("error :>> ", error);
    throw error;
  }
};

export const UpdatePost = async (id: string, data: IPostUpdateDtoType) => {
  await ensureRecordExists({ table: "post", column: "id", value: id });

  const post = await prisma.post.update({
    where: { id },
    data,
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

  return post;
};

export const DeletePost = async (id: string) => {
  await ensureRecordExists({ table: "post", column: "id", value: id });

  const post = await prisma.post.update({
    where: { id },
    data: { isActive: false },
  });

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

  return post;
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
