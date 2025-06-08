"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { format, addMonths, addYears, isToday } from "date-fns";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLDivElement>;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pick a date",
  ref,
  minDate,
  maxDate = new Date(Date.now()),
}: DatePickerProps) {
  const dateValue = value
    ? typeof value === "string"
      ? new Date(value)
      : value
    : undefined;

  const [currentMonth, setCurrentMonth] = useState<Date>(
    dateValue || new Date()
  );
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1889 }, (_, i) => 1900 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quickPresets = [
    { label: "Today", value: new Date(), icon: Clock },
    { label: "Yesterday", value: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { label: "This Week", value: new Date() },
    {
      label: "Last Week",
      value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      setIsAnimating(true);
      setTimeout(() => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(monthIndex);
        setCurrentMonth(newDate);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleYearChange = (year: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(Number.parseInt(year));
      setCurrentMonth(newDate);
      setIsAnimating(false);
    }, 150);
  };

  const navigateMonth = (direction: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth((prev) => addMonths(prev, direction));
      setIsAnimating(false);
    }, 150);
  };

  const navigateYear = (direction: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth((prev) => addYears(prev, direction));
      setIsAnimating(false);
    }, 150);
  };

  const handlePresetSelect = (date: Date) => {
    setCurrentMonth(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange?.(undefined);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen || !calendarRef.current || isAnimating) return;

      const rect = calendarRef.current.getBoundingClientRect();
      const isOverCalendar =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverCalendar) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 1 : -1;

        if (e.ctrlKey || e.metaKey) {
          navigateYear(delta);
        } else {
          navigateMonth(delta);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, isAnimating]);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal h-11 px-4 py-2",
              "border-2 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200 group",
              !dateValue && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              isOpen && "border-primary ring-2 ring-primary/20"
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                {dateValue ? (
                  <span className="flex items-center gap-2">
                    {format(dateValue, "PPP")}
                    {isToday(dateValue) && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </span>
                ) : (
                  placeholder
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {dateValue && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadow-xl border-2"
          align="start"
          sideOffset={8}
        >
          <div
            ref={calendarRef}
            className="bg-background rounded-lg overflow-hidden relative"
          >
            {/* Quick Presets */}
            <div className="p-3 border-b bg-muted/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Quick Select</h3>
                <div className="text-xs text-muted-foreground">
                  or scroll to navigate
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickPresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect(preset.value)}
                    className="h-8 justify-start text-xs hover:bg-primary/10 hover:text-primary"
                  >
                    {preset.icon && <preset.icon className="h-3 w-3 mr-1.5" />}
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Month/Year Selectors */}
            <div className="p-4 border-b bg-gradient-to-r from-muted/20 to-muted/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Navigate</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateYear(-1)}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateYear(1)}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Month
                  </label>
                  <Select
                    value={months[currentMonth.getMonth()]}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Year
                  </label>
                  <Select
                    value={String(currentMonth.getFullYear())}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                onChange?.(date);
                setIsOpen(false);
              }}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              fromDate={minDate}
              toDate={maxDate}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
