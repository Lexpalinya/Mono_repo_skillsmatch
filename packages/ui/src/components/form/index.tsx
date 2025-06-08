import React from "react";
import { cn } from "../../lib/utils";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import {
  Button,
  Input,
  PasswordField,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../index";
import { FormField } from "./form-field";
import { Form as FormUI } from "./react-hook-form";
import { ImageInput } from "./image-input";
import { Combobox } from "./combobox";
import { PasswordInput } from "./password-input";
import { Switch } from "./switch";
import { Select } from "./select";

import { RadioGroupField } from "./radio-group";
import { CheckboxFormField } from "./checkbox";

import { TimePicker } from "./time-picker";
import { DatePicker } from "./date-picker";
import { VirtualizerCombobox } from "./virtualizer-combobox";
import { FormCheckbox } from "./form-checkbox";
import { InfiniteComboboxField } from "./infinite-combobox-field";
import { InputNumberField } from "./input-number-field";
import { ImageInputMulti } from "./image-input-multi";

interface BaseFormProps<TVariables extends FieldValues = FieldValues> {
  formInstance: UseFormReturn<TVariables>;
  onSubmit: (data: TVariables) => void;
  saveButtonText?: string;
  children: React.ReactNode;
  className?: string;
  classNameDialog?: string;
  showButton?: boolean;
  id?: string;
}

export const Form = <TVariables extends FieldValues>({
  formInstance,
  onSubmit,
  saveButtonText = "save",
  children,
  className,

  showButton = true,
  id,
}: BaseFormProps<TVariables>) => {
  const { handleSubmit, formState } = formInstance;

  return (
    <FormUI {...formInstance}>
      <form onSubmit={handleSubmit(onSubmit)} className={cn(className)} id={id}>
        {children}
        {showButton && (
          <Button
            form={id}
            type="submit"
            loading={formState.isSubmitting}
            disabled={formState.isSubmitting}
          >
            {saveButtonText}
          </Button>
        )}
      </form>
    </FormUI>
  );
};

interface FormDialogProps<TVariables extends FieldValues = FieldValues>
  extends BaseFormProps<TVariables> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  resetOnClose?: boolean;
}

export const FormDialog = <TVariables extends FieldValues>({
  formInstance,
  onSubmit,
  children,
  classNameDialog,
  className,
  id = "form-dialog",
  open,
  onOpenChange = () => {},
  title = "Create New Item",
  description = "Fill in the details below to create a new item.",
  saveButtonText = "Save",
  resetOnClose = true,
}: FormDialogProps<TVariables>) => {
  const { handleSubmit, formState, reset } = formInstance;

  const handleOpenChange = (state: boolean) => {
    if (resetOnClose) {
      reset();
    }
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-5xl max-h-[90vh] overflow-y-auto",
          classNameDialog
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FormUI {...formInstance}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(className)}
            id={id}
          >
            {children}
          </form>
        </FormUI>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form={id} type="submit" loading={formState.isSubmitting}>
            {saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

Form.Field = FormField;
Form.Button = Button;
const InputGroup = {
  Input,
  ImageInputMulti,
  ImageInput,
  PasswordField,
  PasswordInput,
  Combobox,
  Textarea,
  Switch,
  Select,
  Radio: RadioGroupField,
  Checkbox: CheckboxFormField,
  FormCheckbox: FormCheckbox,
  TimePicker,
  DatePicker,
  VirtualizerCombobox,
  InfiniteCombobox: InfiniteComboboxField,
  InputNumberField,
};

Form.InputGroup = InputGroup;

FormDialog.Field = FormField;
FormDialog.Button = Button;
FormDialog.InputGroup = InputGroup;
