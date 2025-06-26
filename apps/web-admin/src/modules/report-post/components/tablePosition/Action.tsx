import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@skillsmatch/ui";
import type { Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { type PropsWithChildren } from "react";

import type { IPostAdminDtoType } from "@skillsmatch/dto";
import { useReportPost } from "../../context/useReportPost";

export default function ReportPostAction({
  row,
}: PropsWithChildren<{ row: Row<IPostAdminDtoType> }>) {
  const { setOpen, setCurrentRow } = useReportPost();

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
