import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import {
  BusinessModelUpdateDto,
  type IBusinessModelUpdateDtoType,
} from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";

import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import type { IBusinessModelCurrentRowProps } from "../../utils/type";
import { useBusinessModel } from "../../context/useBusinessModel";
import BusinessModelForm from "../../utils/Form";
import type { IBusinessModelDialogType } from "../../context/Context";

export default function Edit({
  open,
  currentRow,
}: IBusinessModelCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetState,
  } = useBusinessModel();

  const form = useForm<IBusinessModelUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(BusinessModelUpdateDto),
  });

  const onSubmit = async (values: IBusinessModelUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.businessModel.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetState();
      form.reset();
      refetch();

      toast.success("Business model updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the business model. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Business Model",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return BusinessModelForm({
    open,
    setOpen: (value) => setOpen(value as IBusinessModelDialogType),
    form,
    onSubmit,
  });
}
