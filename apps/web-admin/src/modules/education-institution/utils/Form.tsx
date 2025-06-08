import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const EducationalInstitutionForm = <T extends FieldValues>({
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
      title={title ?? "Educational Institution Form"}
      description={description ?? "Update the details for this institution."}
    >
      <FormDialog.Field
        name="name"
        label="Institution Name"
        description="The name of the educational institution."
      >
        <FormDialog.InputGroup.Input placeholder="e.g., ABC University" />
      </FormDialog.Field>
      <FormDialog.Field name="visible">
        <FormDialog.InputGroup.Switch
          label="Visibility"
          description="Make this institution visible to all users."
        />
      </FormDialog.Field>
    </FormDialog>
  );
};

export default EducationalInstitutionForm;
