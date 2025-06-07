import {
  IPostCreateDtoType,
  IPostPaginationDtoType,
  IPostUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { queryTable } from "@utils/pagination";
import { Prisma } from "@prisma/client";

export const CreatePost = async (data: IPostCreateDtoType) => {
  const post = await prisma.post.create({
    data,
    include: {
      PostCourseP: true,
      PostMajor: true,
      PostEducationLevel: true,
      PostEducationInstitution: true,
      PostJobPositionDetail: {
        include: {
          PostJobPositionDetailSkill: true,
        },
      },
    },
  });
  return post;
};

export const UpdatePost = async (id: string, data: IPostUpdateDtoType) => {
  await ensureRecordExists({ table: "post", column: "id", value: id });

  const post = await prisma.post.update({
    where: { id },
    data,
    include: {
      PostCourseP: true,
      PostMajor: true,
      PostEducationLevel: true,
      PostEducationInstitution: true,
      PostJobPositionDetail: {
        include: {
          PostJobPositionDetailSkill: true,
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

      PostJobPositionDetail: {
        select: {
          jp: {
            select: {
              id: true,
              name: true,
            },
          },
          PostJobPositionDetailSkill: {
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

export const GetPostById = async (id: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
    include: {
      PostCourseP: true,
      PostMajor: true,
      PostEducationLevel: true,
      PostEducationInstitution: true,
      PostJobPositionDetail: {
        include: {
          PostJobPositionDetailSkill: true,
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
