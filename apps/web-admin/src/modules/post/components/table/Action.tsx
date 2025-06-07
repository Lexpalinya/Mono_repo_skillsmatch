import {
  Button,
  confirm,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@skillsmatch/ui";
import type { Row } from "@tanstack/react-table";
import {
  CheckCircle,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { type PropsWithChildren } from "react";

import trpcClient from "@/libs/trpc-client";

import { toast } from "sonner";

import { usePost } from "../../context/usePost";
import type { IPostAdminDtoType } from "@skillsmatch/dto";

export default function PostAction({
  row,
}: PropsWithChildren<{ row: Row<IPostAdminDtoType> }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    setCurrentRow,
    resetPostState,
  } = usePost();

  const handleDelete = async () => {
    try {
      await trpcClient.post.delete.mutate({ id: row.original.id });
      resetPostState(row.original.id);
      refetch();
      toast.success("Post deleted successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch {
      confirm({
        actionText: "Retry",
        title: "Failed to delete post",
        description:
          "An error occurred while deleting the post. Please try again.",
        CancelProps: { className: "hidden" },
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.original.id)}
        >
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setOpen("view");
            setCurrentRow(row.original);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setOpen("edit");
            setCurrentRow(row.original);
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit post
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setOpen("verified");
            setCurrentRow(row.original);
          }}
        >
          {row.original.isActive ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Unpublish Post
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish Post
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            const next = await confirm({
              title: "Are you sure?",
              description: "This action cannot be undone.",
              actionText: "Delete",
              cancelText: "Cancel",
            });

            if (next) handleDelete();
          }}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
