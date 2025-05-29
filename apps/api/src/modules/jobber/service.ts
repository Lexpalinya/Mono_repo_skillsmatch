import {
  IJobberAdminDtoType,
  IJobberCreateDtoType,
  IJobberPaginationDtoType,
  IJobberUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Jobber, Prisma } from "@prisma/client";
import { z } from "zod";

export const CreateJobber = async (data: IJobberCreateDtoType) => {
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
          },
        },
        status: {
          select: {
            id: true,
          },
        },
      },
    });

    return jobber;
  } catch (error) {
    throw error;
  }
};

export const GetJobbers = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
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
      status: {
        select: {
          name: true,
        },
      },
      member: {
        select: {
          username: true,
          profile: true,
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
    throw error;
  }
};

export const GetStatsJobber = async () => {
  try {
    const total = await prisma.jobber.count({
      where: { isActive: true },
    });

    const active = await prisma.jobber.count({
      where: {
        isActive: true,
      },
    });

    const jobber = await prisma.jobber.count({
      where: {
        isActive: true,
      },
    });

    const company = await prisma.jobber.count({
      where: {
        isActive: true,
      },
    });

    return { total, active, jobber, company };
  } catch (error) {
    throw error;
  }
};
