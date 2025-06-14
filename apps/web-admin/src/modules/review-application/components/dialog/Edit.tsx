import type { IReviewApplicationCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { ReviewUpdateDto, type IReviewUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useReviewApplication } from "../../context/useReviewApplication";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import ReviewApplicationForm from "../../utils/Form";

export default function Edit({
  open,
  currentRow,
}: IReviewApplicationCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetReViewApplicationState,
  } = useReviewApplication();

  const form = useForm<IReviewUpdateDtoType>({
    values: {
      comment: currentRow.comment,
      score: currentRow.score,
    },
    resolver: zodResolver(ReviewUpdateDto),
  });

  const onSubmit = async (values: IReviewUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.review.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetReViewApplicationState();
      form.reset();
      refetch();

      toast.success("Review Application updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the Review Application. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Review Application",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return ReviewApplicationForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    currentRow,
    onSubmit,
  });
}
