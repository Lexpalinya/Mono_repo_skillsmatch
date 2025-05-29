import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const JobberStatusForm = <T extends FieldValues>({
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
      id={"jobber-status-form"}
      classNameDialog="sm:max-w-[500px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={title || "Jobber Status Form"}
      description={description || "Update the details for this jobber status."}
    >
      <FormDialog.Field
        name="name"
        label="Status Name"
        description="The name of the status as it will appear to users."
      >
        <FormDialog.InputGroup.Input placeholder="e.g., Active, Pending, Suspended" />
      </FormDialog.Field>
      <FormDialog.Field name="visible">
        <FormDialog.InputGroup.Switch
          label="Visibility"
          description="Make this status visible to all users."
        />
      </FormDialog.Field>
    </FormDialog>
  );
};

export default JobberStatusForm;
