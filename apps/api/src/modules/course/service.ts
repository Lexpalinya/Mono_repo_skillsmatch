import { ICourseCreateDtoType, ICourseUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Course } from "@prisma/client";

export const CreateCourse = async (data: ICourseCreateDtoType) => {
    await ensureUniqueRecord({ table: "course", column: "name", value: data.name });
    const course = await prisma.course.create({
        data
    });
    return course;
};

export const UpdateCourse = async (id: string, data: ICourseUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "course", column: "name", value: data.name });
    await ensureRecordExists({ table: "course", column: "id", value: id });
    const course = await prisma.course.update({
        where: {
            id
        },
        data
    });
    return course;
};

export const DeleteCourse = async (id: string) => {
    await ensureRecordExists({ table: "course", column: "id", value: id });
    const course = await prisma.course.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
    return course;
};

export const GetCourse = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Course>) => {
    try {
        const members = await queryTable("course", {
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
export const GetCourseById = async (id: string) => {
    const course = await prisma.course.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    });
    return course;
};
