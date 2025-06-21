import {
  IJobberCreateDtoType,
  IJobberPaginationDtoType,
  IJobberStatsDtoType,
  IJobberUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { queryTable } from "@utils/pagination";
import { Prisma } from "@prisma/client";
import { t } from "@lib/trpc";
import { TRPCError } from "@trpc/server";

export const CreateJobber = async (data: IJobberCreateDtoType) => {
  try {

    await ensureUniqueRecord({
      table: "company",
      column: "memberId",
      value: data.memberId,
    });
    await ensureUniqueRecord({
      table: "jobber",
      column: "memberId",
      value: data.memberId,
    });
    const jobber = await prisma.jobber.create({
      data,
    });

    return jobber;
  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {

        throw new TRPCError({
          code: "CONFLICT",
          message: "memberId already exists in jobber or company",

        });
      }
      if (error.code === "P2003") {

        throw new TRPCError({
          code: "CONFLICT",
          message: "memberId not found in the system",

        });
      }

    }
    throw error;

  }
};

export const UpdateJobber = async (id: string, data: IJobberUpdateDtoType) => {
  if (data.memberId) {
    await ensureUniqueRecord({
      table: "jobber",
      column: "memberId",
      value: data.memberId,
    });
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

export const GetJobber = async (id: string) => {
  try {
    const jobber = await prisma.jobber.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        member: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            profile: true,
          },
        },
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return jobber;
  } catch (error) {
    console.error("Error fetching jobber:", error);
    throw error;
  }
};
export const GetJobberByMemberId = async (id: string) => {
  try {
    const jobber = await prisma.jobber.findFirst({
      where: {
        memberId: id,
        isActive: true,
      },
    });
    return jobber;
  } catch (error) {
    console.error("Error fetching jobber:", error);
    throw error;
  }
};

export const GetJobbers = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  status,
}: IJobberPaginationDtoType) => {
  try {
    let where: Prisma.JobberWhereInput = { isActive: true };

    if (search) {
      where = {
        AND: { isActive: true },
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { member: { username: { contains: search, mode: "insensitive" } } },
        ],
      };
    }
    if (status) {
      where = {
        ...where,
        statusId: status,
      };
    }

    const select: Prisma.JobberSelect = {
      id: true,
      memberId: true,
      gender: true,
      firstName: true,
      lastName: true,
      birthday: true,
      isVerify: true,
      nationality: true,
      createdAt: true,
      statusId: true,
      reason: true,
      status: {
        select: {
          name: true,
        },
      },
      member: {
        select: {
          username: true,
          profile: true,
          email: true,
        },
      },
    };

    const items = await queryTable("jobber", {
      page,
      limit,
      where,
      select,
      orderBy: {
        [sortBy ?? "createdAt"]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    console.error("object :>> error", error);
    throw error;
  }
};

export const GetStatsJobber = async (): Promise<IJobberStatsDtoType> => {
  try {
    const [total, active, verified, status] = await Promise.all([
      prisma.jobber.count({
        where: { isActive: true },
      }),
      prisma.jobber.count({
        where: {
          isActive: true,
        },
      }),
      prisma.jobber.count({
        where: {
          isActive: true,
        },
      }),
      prisma.jobber.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return { total, active, verified, status };
  } catch (error) {
    throw error;
  }
};
