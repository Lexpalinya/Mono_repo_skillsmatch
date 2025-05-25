import { FormDialog } from "@skillsmatch/ui";
import type { FieldValues, useForm } from "react-hook-form";

const MemberForm = <T extends FieldValues>({
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
      classNameDialog="sm:max-w-[750px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={title || "Member Form"}
      description={description || "Update the details for this member."}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormDialog.Field name="username" label="Username">
          <FormDialog.InputGroup.Input placeholder="alex" />
        </FormDialog.Field>
        <FormDialog.Field name="name" label="Role">
          <FormDialog.InputGroup.Select
            defaultValue="jobber"
            options={[
              { value: "jobber", label: "Jobber" },
              { value: "company", label: "Company" },
              { value: "admin", label: "Admin" },
            ]}
          />
        </FormDialog.Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormDialog.Field name="email" label="Email">
          <FormDialog.InputGroup.Input placeholder="alex@example.com" />
        </FormDialog.Field>
        <FormDialog.Field name="phoneNumber" label="Phone Number">
          <FormDialog.InputGroup.Input placeholder="+8562012345678" />
        </FormDialog.Field>
      </div>
      <FormDialog.Field name="password" label="Password">
        <FormDialog.InputGroup.PasswordInput />
      </FormDialog.Field>
      <div className="grid grid-cols-2 gap-4">
        <FormDialog.Field
          name="block"
          label="Block Status"
          description="Block this member from accessing the system."
        >
          <FormDialog.InputGroup.Switch />
        </FormDialog.Field>
      </div>
    </FormDialog>
  );
};

export default MemberForm;
