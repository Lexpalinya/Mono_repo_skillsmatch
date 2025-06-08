import React, { forwardRef } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../../lib/utils";

interface Option {
  value?: string | number;
  label?: string;
}

type CheckboxFormFieldProps = {
  name?: string;
  label?: string;
  options?: Option[];
  className?: string;
};

export const CheckboxFormField = forwardRef<
  HTMLInputElement,
  CheckboxFormFieldProps
>(({ name, label, options, className, ...props }, ref) => {
  const { control, setValue } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={cn("space-y-2", className)}>
              {options.map((item) => (
                <div key={item.value} className="flex items-center space-x-3">
                  <Checkbox
                    checked={
                      Array.isArray(field.value) &&
                      field.value.includes(item.value)
                    }
                    onCheckedChange={(checked) => {
                      const newValue = Array.isArray(field.value)
                        ? [...field.value]
                        : [];
                      if (checked) {
                        newValue.push(item.value);
                      } else {
                        const index = newValue.indexOf(item.value);
                        if (index !== -1) newValue.splice(index, 1);
                      }
                      field.onChange(newValue);
                    }}
                  />
                  <label>{item.label}</label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

CheckboxFormField.displayName = "CheckboxFormField";
