import type { ISkillAdminDtoType } from "@skillsmatch/dto";
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
import { useSkill } from "../../context/useSkill";
import trpcClient from "@/libs/trpc-client";

export default function SkillAction({
  row,
}: PropsWithChildren<{ row: Row<ISkillAdminDtoType> }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    setCurrentRow,
    resetSkillState,
  } = useSkill();
  const handleDelete = async () => {
    try {
      console.log("Deleting skill with ID: ", row.original.id);
      await trpcClient.skill.delete.mutate({ id: row.original.id });
      resetSkillState();
      refetch();
    } catch (error) {
      confirm({
        actionText: "Retry",
        title: "Failed to delete Skill",
        description:
          "An error occurred while deleting the skill. Please try again.",
        CancelProps: { className: "hidden" },
      });
    }
  };
  return (
    <>
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
            Edit skill
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
            Delete skill
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
