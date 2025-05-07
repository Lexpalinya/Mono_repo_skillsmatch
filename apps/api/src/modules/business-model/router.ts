import { z } from "zod";
import {
    CreateBusinessModel,
    DeleteBusinessModel,
    GetBusinessModel,
    GetBusinessModelById,
    UpdateBusinessModel,
} from "./service";
import {
    idDto,
    IIdDtoType,
    IBusinessModelCreateDtoType,
    BusinessModelCreateDto,
    BusinessModelUpdateDto,
    QueryDto,
    IQueryDtoType,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const businessModelRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetBusinessModel(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetBusinessModelById(input.id);
        }),

    create: publicProcedure
        .input(BusinessModelCreateDto)
        .mutation(async ({ input }: { input: IBusinessModelCreateDtoType }) => {
            return CreateBusinessModel(input);
        }),

    update: publicProcedure
        .input(BusinessModelUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: z.infer<typeof BusinessModelUpdateDto> & IIdDtoType }) => {
                const { id, ...data } = input;
                return UpdateBusinessModel(id, data);
            }
        ),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteBusinessModel(input.id);
        }),
});
