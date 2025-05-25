import prisma from "../lib/prisma-client";
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

type TableName = keyof PrismaClient;

interface EnsureRecordParams {
    table: TableName;
    column: string;
    value: any;
    where?: any;
}

const validateColumn = (column: string) => {
    if (typeof column !== "string" || column.trim() === "") {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invalid column name`,
        });
    }
};

export const ensureRecordExists = async <T>({
    table,
    column,
    value,
    where = {},
}: EnsureRecordParams) => {
    validateColumn(column);
    const record = await (prisma[table] as any).findFirst({
        where: {
            [column]: value,
            ...where,
        },
    });


    if (!record) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `${table.toString()} record not found where ${column} = ${value} ${where ? `and ${JSON.stringify(where)}` : ''}`,
        });
    }

    return record;
};

export const ensureUniqueRecord = async ({
    table,
    column,
    value,
    where = {},
}: EnsureRecordParams) => {
    validateColumn(column);

    const record = await (prisma[table] as any).findFirst({
        where: {
            [column]: value,
            ...where,
        },
    });

    if (record) {
        throw new TRPCError({
            code: 'CONFLICT',
            message: `${table.toString()} record already exists where ${column} = ${value}  ${where ? `and ${JSON.stringify(where)}` : ''}`,
        });
    }
};
