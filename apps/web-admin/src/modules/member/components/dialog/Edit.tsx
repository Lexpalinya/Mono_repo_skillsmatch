import type { IMemberCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import {
  MemberUpdateFileDto,
  type IMemberFileUpdateDtoType,
} from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";

import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";

import { useMember } from "../../context/useMember";
import { uploadImageToCloudinary } from "@skillsmatch/config";
import MemberForm from "../../utils/Form";

export default function Edit({ open, currentRow }: IMemberCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetMemberState,
  } = useMember();

  const form = useForm<IMemberFileUpdateDtoType>({
    values: {
      ...currentRow,
    },
    resolver: zodResolver(MemberUpdateFileDto),
  });

  const onSubmit = async (values: IMemberFileUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }
      if (values.profile instanceof File) {
        values.profile = await uploadImageToCloudinary(values.profile);
      }

      if (values.background instanceof File) {
        values.background = await uploadImageToCloudinary(values.background);
      }
      form.setValue("profile", values.profile);
      form.setValue("background", values.background);

      await trpcClient.member.update.mutate({
        id: currentRow.id,
        ...values,
        profile: typeof values.profile === "string" ? values.profile : null,
        background:
          typeof values.background === "string" ? values.background : null,
      });

      resetMemberState(currentRow.id);
      form.reset();
      refetch();

      toast.success("Member updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the major. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Member",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return MemberForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Edit Member",
    description: "Update member information.",
  });
}
