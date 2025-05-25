import type { IMemberCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { MajorUpdateDto, type IMemberUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";

import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import MajorForm from "../../utils/Form";
import { useMember } from "../../context/useMember";

export default function Edit({ open, currentRow }: IMemberCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetMajorState,
  } = useMember();

  const form = useForm<IMemberUpdateDtoType>({
    defaultValues: {
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(MajorUpdateDto),
  });

  const onSubmit = async (values: IMemberUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.member.update.mutate({
        ...changedFields,
        id: "",
      });

      resetMajorState();
      form.reset();
      refetch();

      toast.success("Major updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the major. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Major",
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
  });
}
