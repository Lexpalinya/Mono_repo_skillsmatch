import type { IMajorProps } from "../../utils/type";
import MajorForm from "../../utils/Form";
import { useMajor } from "../../context/useMajor";
import { useForm } from "react-hook-form";
import { MajorCreateDto, type IMajorCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IMajorProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetMajorState,
  } = useMajor();

  const form = useForm<IMajorCreateDtoType>({
    defaultValues: {
      name: "",
      visible: true,
    },
    resolver: zodResolver(MajorCreateDto),
  });

  const onSubmit = async (values: IMajorCreateDtoType) => {
    try {
      // TODO: upload image to s3

      await trpcClient.major.create.mutate({
        ...values,
      });

      resetMajorState();
      form.reset();
      refetch();

      toast.success("Major created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the major. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Major",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return MajorForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Create New Major",
    description: "Add a new major that can be associated with courses",
  });
}
