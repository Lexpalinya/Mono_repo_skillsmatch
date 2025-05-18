import React, { forwardRef } from "react";
import { Checkbox, Label } from "../../index";
import { FormControl, FormLabel, } from "./react-hook-form";
import { cn } from "../../lib/utils";

export interface Option {
  value: string | number;
  label: string;
}

interface Props {
  options: Option[];
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
}

export const CheckboxField = forwardRef<HTMLButtonElement, Props>(
  ({ options, value, onChange, className }, ref) => {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        {options.map((option, index) => (
          <Label key={index} className="flex items-center space-x-2">
            <Checkbox
              ref={ref}
              value={option.value.toString()}
              checked={value?.toString() === option.value.toString()}
              onCheckedChange={(checked) =>
                onChange?.(checked ? option.value.toString() : "")
              }
            />
            <span>{option.label}</span>
          </Label>
        ))}
      </div>
    );
  }
);

CheckboxField.displayName = "CheckboxField";