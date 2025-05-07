import { z } from "zod";
import {
    CreateEducationalInstitution,
    DeleteEducationalInstitution,
    GetEducationalInstitution,
    GetEducationalInstitutionById,
    UpdateEducationalInstitution,
} from "./service";
import {
    idDto,
    IIdDtoType,
    IEducationalInstitutionCreateDtoType,
    EducationalInstitutionCreateDto,
    EducationalInstitutionUpdateDto,
    IQueryDtoType,
    QueryDto,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const educationalInstitutionRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetEducationalInstitution(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetEducationalInstitutionById(input.id);
        }),

    create: publicProcedure
        .input(EducationalInstitutionCreateDto)
        .mutation(async ({ input }: { input: IEducationalInstitutionCreateDtoType }) => {
            return CreateEducationalInstitution(input);
        }),

    update: publicProcedure
        .input(EducationalInstitutionUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: z.infer<typeof EducationalInstitutionUpdateDto> & IIdDtoType }) => {
                const { id, ...data } = input;
                return UpdateEducationalInstitution(id, data);
            }
        ),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteEducationalInstitution(input.id);
        }),
});
