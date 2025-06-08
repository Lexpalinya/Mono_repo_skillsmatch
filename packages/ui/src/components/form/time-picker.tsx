import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Clock as ClockIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
  ScrollBar,
} from "../../index";
import { FormControl } from "./react-hook-form";

function parseTimeStringToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
}
export type TimePickerProps = {
  placeholder?: string;
  onChange?: (value: string | number) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
};

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      placeholder = "HH:mm",
      onChange,
      value,
      defaultValue,
      disabled = false,
      className,
    },
    ref
  ) => {
    const parsedValue = useMemo(() => {
      if (value) return parseTimeStringToDate(value);
      if (defaultValue) return parseTimeStringToDate(defaultValue);
      return new Date();
    }, [value, defaultValue]);

    const [date, setDate] = useState<Date>(parsedValue);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (value !== undefined && value !== null) {
        const newDate = new Date(value);
        if (!isNaN(newDate.getTime())) {
          setDate(newDate);
        }
      }
    }, [value]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

    const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(newValue));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(newValue));
      }

      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      setDate(newDate);
      onChange?.(newDate.toTimeString().slice(0, 8));
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full h-10 justify-start text-left font-normal",
                !date && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              <ClockIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "HH:mm") : <span>{placeholder}</span>}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            {/* Hours */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() === hour ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            {/* Minutes */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

TimePicker.displayName = "TimePicker";
