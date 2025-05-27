import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const CourseForm = <T extends FieldValues>({
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
      id={"login-form"}
      classNameDialog="sm:max-w-[500px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={title || "Course Form"}
      description={description || "Update the details for this course."}
    >
      <FormDialog.Field
        name="name"
        label="Course Name"
        description="The name of the course as it will appear to users."
      >
        <FormDialog.InputGroup.Input placeholder="e.g., Introduction to Programming" />
      </FormDialog.Field>
      <FormDialog.Field name="visible">
        <FormDialog.InputGroup.Switch
          label="Visibility"
          description="Make this course visible to all users."
        />
      </FormDialog.Field>
    </FormDialog>
  );
};

export default CourseForm;
