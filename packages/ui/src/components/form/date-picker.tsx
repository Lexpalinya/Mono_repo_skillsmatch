import React, { forwardRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

import {
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../index";
import { FormControl } from "./react-hook-form";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange, disabled, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !value && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                {value ? format(value, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                onChange?.(date ? date.toDateString() : undefined);
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
