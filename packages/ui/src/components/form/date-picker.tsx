"use client";

import React from "react";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { format, addMonths, addYears, isToday } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pick a date",
  ref,
}: DatePickerProps) {
  // Convert string to Date if needed
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
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Generate years array (1900 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1889 }, (_, i) => 1900 + i);

  // Generate months array
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

  // Quick date presets
  const quickPresets = [
    { label: "Today", value: new Date(), icon: Clock },
    { label: "Yesterday", value: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { label: "This Week", value: new Date() },
    {
      label: "Last Week",
      value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  // Handle month change with animation
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

  // Handle year change with animation
  const handleYearChange = (year: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(Number.parseInt(year));
      setCurrentMonth(newDate);
      setIsAnimating(false);
    }, 150);
  };

  // Handle quick navigation
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

  // Handle preset selection
  const handlePresetSelect = (date: Date) => {
    setCurrentMonth(date);
    onChange?.(date);
    setIsOpen(false);
  };

  // Clear selection
  const clearSelection = () => {
    onChange?.(undefined);
  };

  // Handle mouse wheel scrolling
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
                {quickPresets.slice(0, 4).map((preset) => (
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

            {/* Enhanced Month/Year Navigation */}
            <div className="p-4 border-b bg-gradient-to-r from-muted/20 to-muted/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Navigate</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateYear(-1)}
                    className="h-7 w-7 p-0 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="h-7 w-7 p-0 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="h-7 w-7 p-0 hover:bg-primary/10"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateYear(1)}
                    className="h-7 w-7 p-0 hover:bg-primary/10"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Month Selection */}
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
                      <div className="grid grid-cols-1 gap-1 p-1">
                        {months.map((month, index) => (
                          <SelectItem
                            key={month}
                            value={month}
                            className={cn(
                              "cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-accent",
                              index === currentMonth.getMonth() &&
                                "bg-primary/10 text-primary"
                            )}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Year
                  </label>
                  <Select
                    value={currentMonth.getFullYear().toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {years.reverse().map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className={cn(
                              "cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-accent text-center",
                              year === currentMonth.getFullYear() &&
                                "bg-primary/10 text-primary"
                            )}
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Calendar with Animation */}
            <div
              className={cn(
                "transition-opacity duration-150",
                isAnimating && "opacity-50"
              )}
            >
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  onChange?.(date);
                  if (date) {
                    setIsOpen(false);
                  }
                }}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                captionLayout="buttons"
                showOutsideDays={true}
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                  month: "space-y-4",
                  caption: "hidden",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] h-10 flex items-center justify-center",
                  row: "flex w-full mt-1",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: cn(
                    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none aria-selected:opacity-100",
                    "h-10 w-10 hover:bg-accent hover:text-accent-foreground hover:scale-105",
                    "relative overflow-hidden"
                  ),
                  day_selected: cn(
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    "focus:bg-primary focus:text-primary-foreground shadow-md scale-105"
                  ),
                  day_today:
                    "bg-accent text-accent-foreground font-bold ring-2 ring-primary/20",
                  day_outside:
                    "text-muted-foreground opacity-40 hover:opacity-60",
                  day_disabled: "text-muted-foreground opacity-30",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t bg-muted/10 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {dateValue
                  ? `Selected: ${format(dateValue, "MMM d, yyyy")}`
                  : "No date selected"}
              </div>
              <div className="flex gap-2">
                {dateValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-8 text-xs"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(new Date())}
                  className="h-8 text-xs"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
