import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  Button,
} from "@skillsmatch/ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import trpcClient from "@/libs/trpc-client";
import ViewSkeleton from "../ViewSkeleton";
import { useJobber } from "../../../context/useJobber";
import type { IJobberCurrentRowProps } from "../../../utils/type";


import type { IJobberAdminViewDto } from "@skillsmatch/dto";

export default function View({ open, currentRow }: IJobberCurrentRowProps) {
  const { setOpen } = useJobber();

  const {  isLoading, error } = useQuery({
    queryKey: ["JobberDetail", currentRow.id],
    queryFn: async (): Promise<IJobberAdminViewDto> => {
      return await trpcClient.jobber.getById.query({ id: currentRow.id });
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading)
    return (
      <Dialog open={open} onOpenChange={() => setOpen(null)}>
        <ViewSkeleton />
      </Dialog>
    );

  if (error) return null;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Jobber Details</DialogTitle>
          <DialogDescription>
            Detailed information about this data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4"></div>

        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
