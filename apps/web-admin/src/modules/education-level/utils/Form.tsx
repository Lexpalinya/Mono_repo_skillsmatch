import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const EducationLevelForm = <T extends FieldValues>({
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
      title={title || "Education Level Form"}
      description={description || "Update the details for this education level."}
    >
      <FormDialog.Field
        name="name"
        label="Education Level Name"
        description="The name of the education level as it will appear to users."
      >
        <FormDialog.InputGroup.Input placeholder="e.g., Bachelor Degree" />
      </FormDialog.Field>
      <FormDialog.Field
        name="visible"
        label="Visibility"
        description="Make this education level visible to all users."
      >
        <FormDialog.InputGroup.Switch />
      </FormDialog.Field>
    </FormDialog>
  );
};

export default EducationLevelForm;
