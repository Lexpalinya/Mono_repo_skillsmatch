import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type QueryOptions<TModel> = {
    where?: Partial<TModel>;
    page?: number;
    pageSize?: number;
    orderBy?: any;
    include?: any;
};

export const queryTable = async <TModel extends keyof PrismaClient>(
    modelName: TModel,
    options: QueryOptions<any> = {}
) => {
    const {
        where = {},
        page = 1,
        pageSize = 10,
        orderBy,
        include,
    } = options;

    const skip = (page - 1) * pageSize;

    const model = prisma[modelName] as any;

    if (!model?.findMany || !model?.count) {
        throw new Error(`Invalid model name: ${String(modelName)}`);
    }

    const [data, total] = await Promise.all([
        model.findMany({
            where,
            orderBy,
            include,
            skip,
            take: pageSize,
        }),
        model.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
};
