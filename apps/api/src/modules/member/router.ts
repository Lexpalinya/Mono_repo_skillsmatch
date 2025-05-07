import { z } from "zod";

import {
    idDto,
    IIdDtoType,
    IMemberCreateDtoType,
    IMemberUpdateDtoType,
    MemberCreateDto,
    MemberUpdateDto,
 
    MemberLoginDtoType,
    MemberChangePasswordDtoType,
    QueryDto,
    IQueryDtoType,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";
import { ChangePasswordMember, ForgotPasswordMember, LoginMember, RegisterMember } from "./services/auth";
import { CreateMember, DeleteMember, GetMember, GetMembers, UpdateMember } from "./services/member";


export const memberAuthRouter = router({
    register: publicProcedure
        .input(MemberCreateDto)
        .mutation(async ({ input, ctx }) => {
            const res = await RegisterMember(input);
            ctx.set.headers["set-cookie"] = `token=${res.token}; Path=/; HttpOnly; Secure; SameSite=Strict`;
            return { message: 'Registration successful', token: res.token };
        }),

    login: publicProcedure
        .input(MemberLoginDtoType)
        .mutation(async ({ input, ctx }) => {
            const res = await LoginMember(input);
            ctx.set.headers["set-cookie"] = `token=${res.token}; Path=/; HttpOnly; Secure; SameSite=Strict`;
            return { message: 'Login successful', token: res.token };
        }),

    forgotPassword: publicProcedure
        .input(MemberLoginDtoType)
        .mutation(async ({ input }) => {
            const res = await ForgotPasswordMember(input);

            return { message: 'Password reset instructions sent' };
        }),

    changePassword: publicProcedure
        .input(MemberChangePasswordDtoType)
        .mutation(async ({ input }) => {
            const res = await ChangePasswordMember(input);

            return { message: 'Password changed successfully' };
        }),
});


export const memberRouter = router({

    getAll: publicProcedure
        .input(QueryDto.optional())
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetMembers(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetMember(input.id);
        }),

    create: publicProcedure
        .input(MemberCreateDto)
        .mutation(async ({ input }: { input: IMemberCreateDtoType }) => {
            return CreateMember(input);
        }),

    update: publicProcedure
        .input(MemberUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: IMemberUpdateDtoType & IIdDtoType }) => {
                return UpdateMember(input);
            }
        ),

    delete: publicProcedure
        .input(z.array(z.string()))
        .mutation(async ({ input }: { input: string[] }) => {
            return DeleteMember(input);
        }),
});


