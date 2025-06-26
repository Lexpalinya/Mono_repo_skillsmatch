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
import type { IMemberAdminViewDtoType } from "@skillsmatch/dto";
import ViewHeader from "./ViewHeader";
import BasicInfoCard from "./BasicInfoCard";
import AccountInfoCard from "./AccountInfoCard";
import { useReportMember } from "@/modules/report-member/context/useReportMember";
import type { IMemberCurrentRowProps } from "@/modules/member/utils/type";

export default function View({ open, currentRow }: IMemberCurrentRowProps) {
  const { setOpen } = useReportMember();

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberDetail", currentRow.id],
    queryFn: async (): Promise<IMemberAdminViewDtoType> => {
      return await trpcClient.member.getById.query({ id: currentRow.id });
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
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Detailed information about this data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          {data && <ViewHeader data={data} />}
          {data && <BasicInfoCard data={data} />}
          {data && <AccountInfoCard data={data} />}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
