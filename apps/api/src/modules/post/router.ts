import { t } from "@lib/trpc";
import {
  idDto,
  IIdDtoType,
  IPostCreateDtoType,
  PostCreateDto,
  PostPaginationDto,
  PostUpdateDto,
} from "@skillsmatch/dto";

import {
  GetPost,
  GetPostById,
  CreatePost,
  UpdatePost,
  DeletePost,
  GetStatsPost,
  GetPostUpdate,
  GetPostByCompanyId,
  GetPosts,
} from "./service";

export const postRouter = t.router({
  getAll: t.procedure.input(PostPaginationDto).query(async ({ input }) => {
    return GetPost(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetPostById(input.id);
    }),
  getPostUpdate: t.procedure.input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetPostUpdate(input.id);
    }),

  create: t.procedure
    .input(PostCreateDto)
    .mutation(async ({ input }: { input: IPostCreateDtoType }) => {
      return CreatePost(input);
    }),

  update: t.procedure
    .input(PostUpdateDto._def.schema.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdatePost(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeletePost(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsPost();
  }),

  getPostByCompanyId: t.procedure.input(idDto).query(async ({ input }) => {
    return GetPostByCompanyId(input.id);
  }),
  getPosts: t.procedure.input(PostPaginationDto).query(async ({ input }) => {
    return GetPosts(input);
  }
  )
});
