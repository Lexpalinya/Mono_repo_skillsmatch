import { IBusinessModelCreateDtoType, IBusinessModelUpdateDtoType } from "@skillsmatch/dto";
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { BusinessModel } from "@prisma/client";

export const CreateBusinessModel = async (data: IBusinessModelCreateDtoType) => {
    await ensureUniqueRecord({ table: "businessModel", column: "name", value: data.name })
    const businessModel = await prisma.businessModel.create({
        data
    })
    return businessModel
}
export const UpdateBusinessModel = async (id: string, data: IBusinessModelUpdateDtoType) => {
    if (data.name) await ensureUniqueRecord({ table: "businessModel", column: "name", value: data.name })
    await ensureRecordExists({ table: "businessModel", column: "id", value: id })
    const businessModel = await prisma.businessModel.update({
        where: {
            id
        },
        data
    })
    return businessModel
}

export const DeleteBusinessModel = async (id: string) => {
    await ensureRecordExists({ table: "businessModel", column: "id", value: id })
    const businessModel = await prisma.businessModel.update({
        where: {
            id
        },
        data: {
            isActive: false

        }
    })
    return businessModel
}

export const GetBusinessModel = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<BusinessModel>) => {
    try {
        const members = await queryTable("businessModel", {
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

export const GetBusinessModelById = async (id: string) => {
    const businessModel = await prisma.businessModel.findUniqueOrThrow({
        where: {
            id,
            isActive: true
        }
    })
    return businessModel
}