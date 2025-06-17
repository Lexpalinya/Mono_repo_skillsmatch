import { z } from "zod";

export const QueryDto = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  sortBy: z.string().optional().default("createdAt"),
});

export const SearchDto = z.object({
  search: z.string().optional().default(""),
});
export type ISearchDto = z.infer<typeof SearchDto>;

export const OrderDto = z.object({
  sortBy: z.string().optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type IOrderDto = z.infer<typeof OrderDto>;

export const PaginateRequestDto = SearchDto.merge(OrderDto).extend({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export type IPaginateRequestDto = z.infer<typeof PaginateRequestDto>;

export const OffsetPaginateRequestDto = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export type IOffsetPaginateRequestDto = z.infer<
  typeof OffsetPaginateRequestDto
>;
export const ComboboxDto = OffsetPaginateRequestDto.extend(SearchDto.shape);

export type IComboboxDtoType = z.infer<typeof ComboboxDto>;
