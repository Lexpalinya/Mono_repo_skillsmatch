import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@skillsmatch/ui";
import type { IEducationLevelCurrentRowProps } from "../../utils/type";
import { useEducationLevel } from "../../context/useEducationLevel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { formatDateTime } from "@/utils/formatDateTime";

export default function View({
  open,
  currentRow,
}: IEducationLevelCurrentRowProps) {
  const { setOpen } = useEducationLevel();

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Education Level Information</DialogTitle>
          <DialogDescription>
            Here’s a complete overview of the selected education level.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">ID:</span>
            <span className="col-span-3 font-mono text-xs">
              {currentRow.id}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Name:</span>
            <span className="col-span-3">{currentRow.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Visibility:</span>
            <div className="col-span-3">
              <Badge variant={currentRow.visible ? "default" : "secondary"}>
                {currentRow.visible ? "Public" : "Hidden"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Post Usage:</span>
            <span className="col-span-3">
              {currentRow.postUsageCount} job positions
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Jobber Usage:</span>
            <span className="col-span-3">
              {currentRow.jobberUsageCount} users
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Created on:</span>
            <span className="col-span-3">
              {formatDateTime(currentRow.createdAt)}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Last updated:</span>
            <span className="col-span-3">
              {formatDateTime(currentRow.updatedAt)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
