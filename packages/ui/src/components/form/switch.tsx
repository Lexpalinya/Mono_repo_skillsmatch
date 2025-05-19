import { Label, Switch as SwitchUI } from "../../index";
import { cn } from "../../lib/utils";
import type { Content as SwitchContentType } from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import { FormControl } from "./react-hook-form";

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
    <div className={cn(className, "flex items-center space-x-2  my-2")}>
      <FormControl>
        <SwitchUI checked={value} onCheckedChange={onChange} {...rest} />
      </FormControl>
      <Label>
        {props.label
          ? props.label
          : value
        }
      </Label>
    </div>
  );
});

Switch.displayName = "Switch";
