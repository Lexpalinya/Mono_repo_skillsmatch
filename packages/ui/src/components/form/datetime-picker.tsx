import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button, Calendar, Popover, PopoverTrigger, PopoverContent, ScrollArea, ScrollBar } from "../../index";
import { FormControl } from "./react-hook-form";

export type DateTimePickerProps = {
    placeholder?: string;
    onChange?: (value: string | number) => void;
    value?: string | number;
    defaultValue?: string | number;
    disabled?: boolean;
    className?: string;
};

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
    (
        {
            placeholder = "MM/DD/YYYY hh:mm aa",
            onChange,
            value,
            defaultValue,
            disabled = false,
            className,
        },
        ref
    ) => {
        const parsedValue = useMemo(() => {
            if (value) return new Date(value);
            if (defaultValue) return new Date(defaultValue);
            return undefined;
        }, [value, defaultValue]);

        const [date, setDate] = useState<Date | undefined>(parsedValue);
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
            if (value !== undefined) {
                setDate(new Date(value));
            }
        }, [value]);

        const hours = Array.from({ length: 12 }, (_, i) => i + 1);

        const handleDateSelect = (selectedDate: Date | undefined) => {
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setHours(date?.getHours() ?? 0);
                newDate.setMinutes(date?.getMinutes() ?? 0);
                setDate(newDate);
                onChange?.(newDate.toISOString());
            }
        };

        const handleTimeChange = (
            type: "hour" | "minute" | "ampm",
            value: string
        ) => {
            if (!date) return;

            const newDate = new Date(date);
            if (type === "hour") {
                const hour = parseInt(value) % 12;
                const isPM = newDate.getHours() >= 12;
                newDate.setHours(hour + (isPM ? 12 : 0));
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                const isCurrentlyPM = currentHours >= 12;
                if (value === "AM" && isCurrentlyPM) {
                    newDate.setHours(currentHours - 12);
                } else if (value === "PM" && !isCurrentlyPM) {
                    newDate.setHours(currentHours + 12);
                }
            }

            setDate(newDate);
            onChange?.(newDate.toISOString());
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
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>{placeholder}</span>}
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                date && date.getHours() % 12 === hour % 12
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("hour", hour.toString())}
                                        >
                                            {hour}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                date && date.getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"
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
                            <ScrollArea>
                                <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                        <Button
                                            key={ampm}
                                            size="icon"
                                            variant={
                                                date &&
                                                    ((ampm === "AM" && date.getHours() < 12) ||
                                                        (ampm === "PM" && date.getHours() >= 12))
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("ampm", ampm)}
                                        >
                                            {ampm}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);
DateTimePicker.displayName = "DateTimePicker";