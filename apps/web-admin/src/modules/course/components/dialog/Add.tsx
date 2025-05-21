import type { ICourseProps } from "../../utils/type";
import CourseForm from "../../utils/Form";
import { useCourse } from "../../context/useCourse";
import { useForm } from "react-hook-form";
import { CourseCreateDto, type ICourseCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: ICourseProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetCourseState,
  } = useCourse();

  const form = useForm<ICourseCreateDtoType>({
    defaultValues: {
      name: "",
      visible: false,
    },
    resolver: zodResolver(CourseCreateDto),
  });

  const onSubmit = async (values: ICourseCreateDtoType) => {
    try {
      // TODO: upload image to s3

      await trpcClient.course.create.mutate({
        ...values,
      });

      resetCourseState();
      form.reset();
      refetch();

      toast.success("Course created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the course. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Course",
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
    title: "Create New Course",
    description: "Add a new course that can be associated with job positions",
  });
}
