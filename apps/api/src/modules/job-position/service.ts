import {
  IJobPositionCreateDtoType,
  IJobPositionUpdateDtoType,
} from "@skillsmatch/dto";

import { Major } from "@prisma/client";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { QueryOptions, queryTable } from "../../utils/pagination";
import { BusinessModel } from "@prisma/client";

export const CreateJobPosition = async (data: IJobPositionCreateDtoType) => {
  await ensureUniqueRecord({
    table: "jobPosition",
    column: "name",
    value: data.name,
  });
  const jobPosition = await prisma.jobPosition.create({
    data,
  });
  return jobPosition;
};

export const UpdateJobPosition = async (
  id: string,
  data: IJobPositionUpdateDtoType
) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "jobPosition",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "jobPosition", column: "id", value: id });
  const jobPosition = await prisma.jobPosition.update({
    where: {
      id,
    },
    data,
  });
  return jobPosition;
};

export const DeleteJobPosition = async (id: string) => {
  await ensureRecordExists({ table: "jobPosition", column: "id", value: id });
  const jobPosition = await prisma.jobPosition.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return jobPosition;
};

export const GetJobPosition = async ({
  where = { isActive: true },
  page = 1,
  pageSize = 10,
  orderBy,
  include,
}: QueryOptions<BusinessModel>) => {
  try {
    const members = await queryTable("jobPosition", {
      where,
      page,
      pageSize,
      orderBy,
      include,
    });

    return members;
  } catch (error) {
    throw error;
  }
};
export const GetJobPositionById = async (id: string) => {
  const jobPosition = await prisma.jobPosition.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return jobPosition;
};
