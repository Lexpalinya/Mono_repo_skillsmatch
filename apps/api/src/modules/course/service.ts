import {
  ICourseCreateDtoType,
  ICoursePaginationDtoType,
  ICourseUpdateDtoType,
} from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "../../utils/ensure";
import prisma from "../../lib/prisma-client";
import { queryTable } from "../../utils/pagination";

export const CreateCourse = async (data: ICourseCreateDtoType) => {
  await ensureUniqueRecord({
    table: "course",
    column: "name",
    value: data.name,
  });
  const course = await prisma.course.create({
    data,
  });
  return course;
};

export const UpdateCourse = async (id: string, data: ICourseUpdateDtoType) => {
  if (data.name)
    await ensureUniqueRecord({
      table: "course",
      column: "name",
      value: data.name,
    });
  await ensureRecordExists({ table: "course", column: "id", value: id });
  const course = await prisma.course.update({
    where: {
      id,
    },
    data,
  });
  return course;
};

export const DeleteCourse = async (id: string) => {
  await ensureRecordExists({ table: "course", column: "id", value: id });
  const course = await prisma.course.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
  return course;
};

export const GetCourse = async ({
  page,
  limit,
  search,
  sortOrder = "asc",
  sortBy,
  visible,
}: ICoursePaginationDtoType) => {
  try {
    let where: any = { isActive: true };
    if (search)
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    if (typeof visible === "boolean") where.visible = visible;
    const items = await queryTable("course", {
      page,
      limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    throw error;
  }
};

export const GetStatsCourse = async () => {
  try {
    const total = await prisma.course.count({
      where: {
        isActive: true,
      },
    });
    const active = await prisma.course.count({
      where: {
        isActive: true,
        visible: true,
      },
    });
    const [mostUsedPost] = await prisma.course.findMany({
      orderBy: { postUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    const [mostUsedJobber] = await prisma.course.findMany({
      orderBy: { jobberUsageCount: "desc" },
      select: {
        id: true,
        name: true,
        postUsageCount: true,
        jobberUsageCount: true,
      },
      take: 1,
    });
    return { total, active, mostUsedPost, mostUsedJobber };
  } catch (error) {
    throw error;
  }
};

export const GetCourseById = async (id: string) => {
  const course = await prisma.course.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
  });
  return course;
};
