"use client";

import { cn } from "../../lib/utils";
import {
  type Content as SelectContentType,
  type SelectProps as SelectCoreProps,
} from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  Select as SelectUI,
  SelectValue,
} from "../../index";
import { FormControl } from "./react-hook-form";

type SelectProps = SelectCoreProps & {
  placeholder?: string;
  emptyMessage?: string;
  onChange?: (value: string | number) => void;
  options?: any[];
  className?: string;
  disabled?: boolean;
};

export const Select = forwardRef<
  React.ElementRef<typeof SelectContentType>,
  SelectProps
>(({ ...props }, ref) => {
  return (
    <SelectUI
      disabled={props.disabled || props.options?.length === 0}
      onValueChange={props.onChange}
      defaultValue={props.defaultValue}
      value={props.value ? props.value : props.defaultValue}
    >
      <FormControl className="h-10">
        <SelectTrigger className={cn("", props?.className)}>
          <SelectValue placeholder={props?.placeholder ?? "select"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent className={cn("", props?.className)} ref={ref}>
        <SelectGroup>
          {props.options?.map((option, key: number) => (
            <SelectItem key={key} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectUI>
  );
});

Select.displayName = "Select";
