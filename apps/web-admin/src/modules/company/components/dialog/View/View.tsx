import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@skillsmatch/ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import trpcClient from "@/libs/trpc-client";
import ViewSkeleton from "../ViewSkeleton";
import { useCompany } from "../../../context/useCompany";
import type { IJobberCurrentRowProps } from "../../../utils/type";

import type { IJobberAdminViewDto } from "@skillsmatch/dto";
import ViewHeader from "./ViewHeader";
import PersonalInfo from "./PersonalInfo";
import Location from "./Location";
import Documents from "./Documents";

export default function View({ open, currentRow }: IJobberCurrentRowProps) {
  const { setOpen } = useCompany();

  const { data, isLoading, error } = useQuery({
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
  if (!data) return null;
  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Jobber Details</DialogTitle>
          <DialogDescription>
            Detailed information about this data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <ViewHeader data={data} />
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-4 pt-4">
            <PersonalInfo data={data} />
          </TabsContent>
          <TabsContent value="location" className="space-y-4 pt-4">
            <Location data={data} />
          </TabsContent>
          <TabsContent value="documents" className="space-y-4 pt-4">
            <Documents data={data} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
