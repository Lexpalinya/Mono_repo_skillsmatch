import { Avatar, AvatarImage, AvatarFallback, Badge } from "@skillsmatch/ui";
import { Star } from "lucide-react";
import { formatDateTime } from "@/utils/formatDateTime";
import type { IReviewAdminDtoType } from "@skillsmatch/dto";
import type { ColumnDef } from "@tanstack/react-table";
import ReviewApplicationAction from "./Action";

export const ReviewApplicationColumn: ColumnDef<IReviewAdminDtoType>[] = [
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={data.member.profile || "/placeholder.svg"}
              alt={data.member.username}
            />
            <AvatarFallback>
              {data.member.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{data.member.username}</div>
            <Badge variant="outline" className="text-xs">
              {data.member.role}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Rating",
    cell: ({ row }) => {
      const score = row.original.score;
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-1 text-sm font-medium">{score}/5</span>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px]">
          <p className="truncate text-sm">{row.original.comment}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.original.createdAt && formatDateTime(row.original.createdAt)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ReviewApplicationAction,
  },
];
