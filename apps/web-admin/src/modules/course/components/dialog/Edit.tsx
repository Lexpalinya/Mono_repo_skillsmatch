import type { ICourseCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { CourseUpdateDto, type ICourseUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useCourse } from "../../context/useCourse";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import CourseForm from "../../utils/Form";

export default function Edit({ open, currentRow }: ICourseCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetCourseState,
  } = useCourse();

  const form = useForm<ICourseUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(CourseUpdateDto),
  });

  const onSubmit = async (values: ICourseUpdateDtoType) => {
    try {
      // TODO: upload image to s3
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.course.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetCourseState();
      form.reset();
      refetch();

      toast.success("Course updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the course. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Course",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return CourseForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
  });
}
