import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type FormCheckboxProps = {
  name: string;
  label: string;
  value: string;
};

export function FormCheckbox({ name, label, value }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isChecked = field.value?.includes(value);

        const handleChange = (checked: boolean) => {
          const newValue = checked
            ? [...field.value, value]
            : field.value.filter((val: string) => val !== value);

          field.onChange(newValue);
        };

        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={value}
              checked={isChecked}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={value}>{label}</Label>
          </div>
        );
      }}
    />
  );
}
