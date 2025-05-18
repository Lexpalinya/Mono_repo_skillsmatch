import { cn } from "../../lib/utils";
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { type Command as CommandPrimitive } from "cmdk";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  CommandList,
} from "../../index";
import { FormControl } from "./react-hook-form";
import React from "react";

interface Option {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

type ComboboxProps = Omit<
  ComponentPropsWithoutRef<typeof CommandPrimitive>,
  "onChange" | "onValueChange" | "value"
> & {
  options?: Option[];
  placeholder?: string;
  emptyMessage?: string;
  onChange?: (value: string | number) => void;
  value?: string | number | Option;
  defaultValue?: string | number;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  popoverWidth?: string;
  searchPlaceholder?: string;
};

export const Combobox = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComboboxProps
>(({
  options = [],
  placeholder = "Select an option",
  emptyMessage = "No options found",
  onChange,
  value,
  defaultValue,
  disabled = false,
  className,
  clearable = false,
  popoverWidth,
  searchPlaceholder = "Search...",
  ...props
}, ref) => {

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const getSelectedValue = () => {
    if (value !== undefined) {
      if (typeof value === 'object' && 'value' in value) {
        return value.value;
      }
      return value;
    }
    return internalValue;
  };
  useEffect(() => {
    if (defaultValue !== undefined && value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  const selectedOption = options.find(
    (option) => option.value === getSelectedValue(),
  );

  const handleSelect = (optionValue: string | number) => {
    if (value === undefined) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === undefined) {
      setInternalValue(undefined);
    }
    onChange?.('' as string);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-10 px-3 transition-all",
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "data-[state=open]:border-ring data-[state=open]:ring-1 data-[state=open]:ring-ring",
              selectedOption && "text-foreground",
              !selectedOption && "text-muted-foreground",
              className
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {selectedOption?.icon}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
            <div className="flex items-center gap-1">
              {clearable && selectedOption && (
                <X
                  className="h-4 w-4 opacity-70 hover:opacity-100 cursor-pointer"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-1" />
            </div>
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("p-0 overflow-hidden", popoverWidth || "w-[var(--radix-popover-trigger-width)]")}
        style={{ width: popoverWidth }}
      >
        <Command ref={ref} {...props} className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-11 border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="overflow-y-auto max-h-60">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => { handleSelect(option.value); }}
                    className={cn(
                      "py-2.5 px-3 cursor-pointer flex items-center gap-2 aria-selected:bg-accent",
                      "transition-colors hover:bg-accent/50 data-[selected=true]:bg-accent"
                    )}
                    data-selected={option.value === getSelectedValue()}
                  >
                    {option.icon}
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        option.value === getSelectedValue()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

Combobox.displayName = "Combobox";