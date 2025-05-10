import { IAttendInterViewCreateDTOType, IAttendInterViewUpdateDTOType } from "@skillsmatch/dto";
import { ensureRecordExists } from "@utils/ensure";
import prisma from "@lib/prisma-client";
import { QueryOptions, queryTable } from "@utils/pagination";
import { AttendInterView } from "@prisma/client";

export const CreateAttendInterView = async (data: IAttendInterViewCreateDTOType) => {
    const attend = await prisma.attendInterView.create({
        data,
    });
    return attend;
};

export const UpdateAttendInterView = async (id: string, data: IAttendInterViewUpdateDTOType) => {
    await ensureRecordExists({ table: "attendInterView", column: "id", value: id });

    const attend = await prisma.attendInterView.update({
        where: { id },
        data,
    });

    return attend;
};

export const DeleteAttendInterView = async (id: string) => {
    await ensureRecordExists({ table: "attendInterView", column: "id", value: id });

    const attend = await prisma.attendInterView.update({
        where: { id },
        data: { isActive: false },
    });

    return attend;
};

export const GetAttendInterView = async ({
    where = { isActive: true },
    page = 1,
    pageSize = 10,
    orderBy,
    include,
}: QueryOptions<AttendInterView>) => {
    return queryTable("attendInterView", {
        where,
        page,
        pageSize,
        orderBy,
        include,
    });
};

export const GetAttendInterViewById = async (id: string) => {
    const attend = await prisma.attendInterView.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
    });

    return attend;
};
