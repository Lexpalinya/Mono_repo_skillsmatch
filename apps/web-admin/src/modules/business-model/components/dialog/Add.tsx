import { useForm } from "react-hook-form";
import {
  BusinessModelCreateDto,
  type IBusinessModelCreateDtoType,
} from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";
import { useBusinessModel } from "../../context/useBusinessModel";
import type { IBusinessModelProps } from "../../utils/type";
import BusinessModelForm from "../../utils/Form";
import type { IBusinessModelDialogType } from "../../context/Context";

export default function Add({ open }: IBusinessModelProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetState,
  } = useBusinessModel();

  const form = useForm<IBusinessModelCreateDtoType>({
    defaultValues: {
      name: "",
      visible: false,
    },
    resolver: zodResolver(BusinessModelCreateDto),
  });

  const onSubmit = async (values: IBusinessModelCreateDtoType) => {
    try {
      await trpcClient.businessModel.create.mutate(values);

      resetState();
      form.reset();
      refetch();

      toast.success("Business model created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      confirm({
        title: "Failed to Create Business Model",
        description: message,
        actionText: "Retry",
        CancelProps: { className: "hidden" },
      });
    }
  };

  return BusinessModelForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Create New Business Model",
    description:
      "Add a new business model that can be associated with job positions",
  });
}
