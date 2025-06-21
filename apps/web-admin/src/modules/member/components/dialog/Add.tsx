import type { IMemberProps } from "../../utils/type";

import { useForm } from "react-hook-form";
import {
  MemberCreateFileDto,
  type IMemberFileCreateDtoType,
} from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";
import { useMember } from "../../context/useMember";
import MemberForm from "../../utils/Form";
import { uploadImageToCloudinary } from "@skillsmatch/config";

export default function Add({ open }: IMemberProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetMemberState,
  } = useMember();

  const form = useForm<IMemberFileCreateDtoType>({
    resolver: zodResolver(MemberCreateFileDto),
  });
  console.log(form.watch());
  const onSubmit = async (values: IMemberFileCreateDtoType) => {
    try {
      if (values.profile instanceof File) {
        values.profile = await uploadImageToCloudinary(values.profile);
      }

      if (values.background instanceof File) {
        values.background = await uploadImageToCloudinary(values.background);
      }

      form.setValue("profile", values.profile);
      form.setValue("background", values.background);

      await trpcClient.member.create.mutate({
        ...values,
        profile: typeof values.profile === "string" ? values.profile : null,
        background:
          typeof values.background === "string" ? values.background : null,
      });

      resetMemberState();
      form.reset();
      refetch();

      toast.success("Member created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the major. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Member",
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
    title: "Create New Member",
    description: "Add a new member to the system.",
  });
}
