import type { ISkillProps } from "../../utils/type";
import SkillForm from "../../utils/Form";
import { useSkill } from "../../context/useSkill";
import { useForm } from "react-hook-form";
import { SkillCreateDto, type ISkillCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: ISkillProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetSkillState,
  } = useSkill();
  const form = useForm<ISkillCreateDtoType>({
    defaultValues: {
      name: "", // Ensure name is always a string
      visible: false,
    },
    resolver: zodResolver(SkillCreateDto),
  });
  const onSubmit = async (values: ISkillCreateDtoType) => {
    try {
      // TODO: upload image to s3

      await trpcClient.skill.create.mutate({
        ...values,
      });

      resetSkillState();
      form.reset();
      refetch();

      toast.success("Skill created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the skill. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Skill",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return SkillForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Create New Skill",
    description: "Add a new skill that can be associated with job positions",
  });
}
