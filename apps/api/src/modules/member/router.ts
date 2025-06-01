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
  MemberPaginationDto,
  MemberComboboxDto,
} from "@skillsmatch/dto";
import { router, t } from "../../lib/trpc";
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
  GetMemberCombobox,
  GetMembers,
  GetStatsMember,
  UpdateMember,
} from "./services/member";
import { jobPositionRouter } from "../job-position/router";

export const memberAuthRouter = router({
  register: t.procedure
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

  login: t.procedure
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

  forgotPassword: t.procedure
    .input(MemberLoginDtoType)
    .mutation(async ({ input }) => {
      const res = await ForgotPasswordMember(input);

      return { message: "Password reset instructions sent" };
    }),

  changePassword: t.procedure
    .input(MemberChangePasswordDtoType)
    .mutation(async ({ input }) => {
      const res = await ChangePasswordMember(input);

      return { message: "Password changed successfully" };
    }),
});

export const memberRouter = router({
  getAll: t.procedure.input(MemberPaginationDto).query(async ({ input }) => {
    return GetMembers(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetMember(input.id);
    }),

  create: t.procedure
    .input(MemberCreateDto)
    .mutation(async ({ input }: { input: IMemberCreateDtoType }) => {
      return CreateMember(input);
    }),

  update: t.procedure
    .input(MemberUpdateDto.extend(idDto.shape))
    .mutation(
      async ({ input }: { input: IMemberUpdateDtoType & IIdDtoType }) => {
        return UpdateMember(input);
      }
    ),

  delete: t.procedure
    .input(z.array(z.string()))
    .mutation(async ({ input }: { input: string[] }) => {
      return DeleteMember(input);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsMember();
  }),

  fetchMemberCombobox: t.procedure
    .input(MemberComboboxDto)
    .query(async ({ input }) => {
      return GetMemberCombobox(input);
    }),
});
