import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const SkillForm = <T extends FieldValues>({
  open,
  setOpen,
  form,
  onSubmit,
  title,
  description,
}: {
  open: boolean;
  setOpen: (value: null | boolean) => void;
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (values: T) => Promise<void>;
  title?: string;
  description?: string;
}) => {
  return (
    <FormDialog
      open={open}
      onOpenChange={() => {
        setOpen(null);
      }}
      classNameDialog="w-[350px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={title || "Skill Form"}
      description={description || "Update the details for this skill."}
    >
      <FormDialog.Field
        name="name"
        label="Skill Name"
        description="The name of the skill as it will appear to users."
      >
        <FormDialog.InputGroup.Input placeholder="My awesome skill..." />
      </FormDialog.Field>
      <FormDialog.Field
        name="visible"
        label="Visibility"
        description="Make this skill visible to all users."
      >
        <FormDialog.InputGroup.Switch
          label="Visibility"
          description="Make this skill visible to all users."
        />
      </FormDialog.Field>
    </FormDialog>
  );
};
export default SkillForm;
