import { IPostCreateDTOType, IPostUpdateDTOType } from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Post } from "@prisma/client";

export const CreatePost = async (data: IPostCreateDTOType) => {
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

export const UpdatePost = async (id: string, data: IPostUpdateDTOType) => {
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
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Post>) => {
    return queryTable("post", {
        where,
        page,
        pageSize,
        orderBy,
        include,
    });
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
