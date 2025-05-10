
import { ensureRecordExists, ensureUniqueRecord } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { Company } from "@prisma/client";
import { ICompanyCreateDTOType, ICompanyUpdateDTOType } from "@skillsmatch/dto";

export const CreateCompany = async (data: ICompanyCreateDTOType) => {
    await ensureUniqueRecord({ table: "company", column: "memberId", value: data.memberId });
    await ensureUniqueRecord({ table: "company", column: "taxPayId", value: data.taxPayId });

    const company = await prisma.company.create({ data });
    return company;
};

export const UpdateCompany = async (id: string, data: ICompanyUpdateDTOType) => {
    if (data.memberId) {
        await ensureUniqueRecord({ table: "company", column: "memberId", value: data.memberId });
    }
    if (data.taxPayId) {
        await ensureUniqueRecord({ table: "company", column: "taxPayId", value: data.taxPayId });
    }

    await ensureRecordExists({ table: "company", column: "id", value: id });

    const company = await prisma.company.update({
        where: { id },
        data,
    });
    return company;
};

export const DeleteCompany = async (id: string) => {
    await ensureRecordExists({ table: "company", column: "id", value: id });

    const company = await prisma.company.update({
        where: { id },
        data: { isActive: false },
    });
    return company;
};

export const GetCompany = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<Company>) => {
    return queryTable("company", {
        where,
        page,
        pageSize,
        orderBy,
        include,
    });
};

export const GetCompanyById = async (id: string) => {
    const company = await prisma.company.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
    });
    return company;
};
