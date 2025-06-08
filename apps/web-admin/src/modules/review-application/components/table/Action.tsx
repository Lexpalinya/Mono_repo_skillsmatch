import type { IReviewAdminDtoType } from "@skillsmatch/dto";
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
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { type PropsWithChildren } from "react";

import trpcClient from "@/libs/trpc-client";
import { useReviewApplication } from "../../context/useReviewApplication";

export default function ReviewApplicationAction({
  row,
}: PropsWithChildren<{ row: Row<IReviewAdminDtoType> }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    setCurrentRow,
    resetReViewApplicationState,
  } = useReviewApplication();

  const handleDelete = async () => {
    try {
      await trpcClient.review.delete.mutate({ id: row.original.id });
      resetReViewApplicationState();
      refetch();
    } catch {
      confirm({
        actionText: "Retry",
        title: "Failed to delete Job Position",
        description:
          "An error occurred while deleting the job position. Please try again.",
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
          Edit Review Application
        </DropdownMenuItem>
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
          Delete Review Application
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
