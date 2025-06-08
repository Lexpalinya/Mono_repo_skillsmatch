import type { IReviewApplicationProps } from "../../utils/type";
import ReviewApplicationForm from "../../utils/Form";
import { useReviewApplication } from "../../context/useReviewApplication";
import { useForm } from "react-hook-form";
import { ReviewCreateDto, type IReviewCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IReviewApplicationProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetReViewApplicationState,
  } = useReviewApplication();

  const form = useForm<IReviewCreateDtoType>({
    defaultValues: {
      comment: "",
      score: 5,
    },
    resolver: zodResolver(ReviewCreateDto),
  });

  const onSubmit = async (values: IReviewCreateDtoType) => {
    try {
      await trpcClient.review.create.mutate({
        ...values,
      });

      resetReViewApplicationState();
      form.reset();
      refetch();

      toast.success("Review Application created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the Review Application. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Review Application",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return ReviewApplicationForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Create New Review Application",
    description:
      "Add a new Review Application that can be associated with courses",
  });
}
