import type { ISkillCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { SkillUpdateDto, type ISkillUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useSkill } from "../../context/useSkill";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import SkillForm from "../../utils/Form";
export default function Edit({ open, currentRow }: ISkillCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetSkillState,
  } = useSkill();
  const form = useForm<ISkillUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "", // Ensure name is always a string
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(SkillUpdateDto),
  });

  const onSubmit = async (values: ISkillUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }
      await trpcClient.skill.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetSkillState();
      form.reset();
      refetch();

      toast.success("Skill updated successfully!", {
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
  });
}
