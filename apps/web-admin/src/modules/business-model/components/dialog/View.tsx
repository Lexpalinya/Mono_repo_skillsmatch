import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@skillsmatch/ui";

import { DialogTitle } from "@radix-ui/react-dialog";
import { formatDateTime } from "@/utils/formatDateTime";
import type { IBusinessModelCurrentRowProps } from "../../utils/type";
import { useBusinessModel } from "../../context/useBusinessModel";

export default function View({
  open,
  currentRow,
}: IBusinessModelCurrentRowProps) {
  const { setOpen } = useBusinessModel();

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Business Model Information</DialogTitle>
          <DialogDescription>
            Here’s a complete overview of the selected business model.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Business Model ID:</span>
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
            <span className="text-sm font-medium">Company Usage:</span>
            <span className="col-span-3">
              {currentRow.companyUsageCount} company usage
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
