import type { IJobberStatusAdminDtoType } from "@skillsmatch/dto";
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
import { useJobberStatus } from "../../context/useJobberStatus";
import trpcClient from "@/libs/trpc-client";

export default function JobberStatusAction({
  row,
}: PropsWithChildren<{ row: Row<IJobberStatusAdminDtoType> }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    setCurrentRow,
    resetJobberStatusState,
  } = useJobberStatus();

  const handleDelete = async () => {
    try {
      console.log("Deleting jobber status with ID: ", row.original.id);
      await trpcClient.jobberStatus.delete.mutate({ id: row.original.id });
      resetJobberStatusState();
      refetch();
    } catch (error) {
      confirm({
        actionText: "Retry",
        title: "Failed to delete Jobber Status",
        description:
          "An error occurred while deleting the jobber status. Please try again.",
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
          onClick={() => navigator.clipboard.writeText(row.original.name)}
        >
          Copy Name
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
          Edit status
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
          Delete status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
