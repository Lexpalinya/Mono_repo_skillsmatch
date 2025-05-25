import { z } from "zod";
import { setCookie } from "hono/cookie";
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
  MemberPaginationDto,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";
import {
  ChangePasswordMember,
  ForgotPasswordMember,
  LoginMember,
  RegisterMember,
} from "./services/auth";
import {
  CreateMember,
  DeleteMember,
  GetMember,
  GetMembers,
  UpdateMember,
} from "./services/member";
import { jobPositionRouter } from "../job-position/router";

export const memberAuthRouter = router({
  register: publicProcedure
    .input(MemberCreateDto)
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;
      // Set cookie using Hono's context
      const result = await RegisterMember(input);
      setCookie(res, "token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return { message: "Registration successful", token: result.token };
    }),

  login: publicProcedure
    .input(MemberLoginDtoType)
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;

      const result = await LoginMember(input);

      setCookie(res, "token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return { message: "Login successful", token: result.token };
    }),

  forgotPassword: publicProcedure
    .input(MemberLoginDtoType)
    .mutation(async ({ input }) => {
      const res = await ForgotPasswordMember(input);

      return { message: "Password reset instructions sent" };
    }),

  changePassword: publicProcedure
    .input(MemberChangePasswordDtoType)
    .mutation(async ({ input }) => {
      const res = await ChangePasswordMember(input);

      return { message: "Password changed successfully" };
    }),
});

export const memberRouter = router({
  getAll: publicProcedure
    .input(MemberPaginationDto)
    .query(async ({ input }) => {
      return GetMembers(input);
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
