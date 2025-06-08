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

import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";
import ViewHeader from "./ViewHeader";
import CompanyDetails from "./CompanyDetails";
import Location from "./Location";
import Documents from "./Documents";

import { usePost } from "@/modules/post/context/usePost";
import type { IPostCurrentRowProps } from "@/modules/post/utils/type";

export default function View({ open, currentRow }: IPostCurrentRowProps) {
  const { setOpen } = usePost();

  const { data, isLoading, error } = useQuery({
    queryKey: ["CompanyDetail", currentRow.id],
    queryFn: async (): Promise<ICompanyAdminViewDtoType> => {
      return await trpcClient.company.getById.query({ id: currentRow.id });
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
          <DialogTitle>Company Details</DialogTitle>
          <DialogDescription>
            Detailed information about this company.
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
            <CompanyDetails data={data} />
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
