import { Label, Switch as SwitchUI } from "../../index";
import { cn } from "../../lib/utils";
import type { Content as SwitchContentType } from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import { FormControl } from "./react-hook-form";
import { FormDescription, FormLabel } from "../ui/form";

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  options?: any[];
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
  require?: boolean;
  label?: string;
  description?: string;
}

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchContentType>,
  SwitchProps
>((props, ref) => {
  const {
    value,
    onChange,
    activeLabel,
    inactiveLabel,
    className,
    require = true,
    ...rest
  } = props;
  return (
    <div
      className={cn(
        className,
        "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
      )}
    >
      <div className="space-y-0.5">
        <FormLabel>{props.label}</FormLabel>
        <FormDescription>{props.description}</FormDescription>
      </div>
      <FormControl>
        <SwitchUI checked={value} onCheckedChange={onChange} {...rest} />
      </FormControl>
    </div>
  );
});

Switch.displayName = "Switch";
