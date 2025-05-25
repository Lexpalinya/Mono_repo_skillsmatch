import type { IMemberProps } from "../../utils/type";

import { useForm } from "react-hook-form";
import { MemberCreateDto, type IMemberCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";
import { useMember } from "../../context/useMember";
import MemberForm from "../../utils/Form";


export default function Add({ open }: IMemberProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetMajorState,
  } = useMember();

  const form = useForm<IMemberCreateDtoType>({
    defaultValues: {
      visible: true,
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      profile: "",
      role: "jobber",
      background: "",
      block: false,
    },
    resolver: zodResolver(MemberCreateDto),
  });

  const onSubmit = async (values: IMemberCreateDtoType) => {
    try {
      await trpcClient.member.create.mutate({
        ...values,
      });

      resetMajorState();
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
