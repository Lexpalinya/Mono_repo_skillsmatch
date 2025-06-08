import { Button } from "@skillsmatch/ui";

import ReviewApplicationStatsCard from "../components/ReviewApplicationStatsCard";
import { ReviewApplicationTable } from "../components/table/Table";
import ReviewApplicationProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useReviewApplication } from "../context/useReviewApplication";
import ReviewApplicationDialog from "../components/dialog/ReviewApplicationDialog";

export default function ReviewApplicationPage() {
  return (
    <ReviewApplicationProvider>
      <ReviewApplicationContent />
      <ReviewApplicationDialog />
    </ReviewApplicationProvider>
  );
}

export const ReviewApplicationContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Review Application</h1>
        <p className="text-sm text-muted-foreground">
          Manage application reviews and user feedback
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <ReviewApplicationStatsCard />
    <ReviewApplicationTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useReviewApplication();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Review
    </Button>
  );
};
