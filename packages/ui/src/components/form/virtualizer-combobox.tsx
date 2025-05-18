import * as React from "react";
import { Command, CommandEmpty, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDown, Check, SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FormControl } from "./react-hook-form";
import { forwardRef, type ElementRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

const List = ({
  options,
  value: [value, setValue],
  setOpen,
  handleSelect,
}: {
  options: Option[];
  value: [string, React.Dispatch<React.SetStateAction<string>>];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelect: (optionValue: string | number) => void;
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.stopPropagation();
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  }, []);

  return (
    <div
      ref={parentRef}
      className="max-h-[200px] overflow-y-auto relative pointer-events-auto"
    >
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = options[virtualRow.index];
          return (
            <div
              key={item.value}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <CommandItem
                value={String(item.value)}
                onSelect={() => {
                  setValue(item.value.toString());
                  setOpen(false);
                  handleSelect(item.value);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value.toString()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const VirtualizerCombobox = forwardRef<
  ElementRef<"input">,
  {
    options: Option[];
    onChange?: (value: string | number) => void;
    value?: string | number | Option;
    defaultValue?: string | number;
    name?: string;
    placeholder?: string;
  }
>(
  (
    { options, onChange, value, defaultValue, name, placeholder, ...props },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const [internalValue, setInternalValue] = React.useState<
      string | number | undefined
    >(defaultValue);
    const [inputValue, setInputValue] = React.useState("");

    const selectedValue = React.useMemo(() => {
      if (typeof value === "object" && value && "value" in value) {
        return value.value;
      }
      return value ?? internalValue;
    }, [value, internalValue]);

    const filtered = React.useMemo(() => {
      if (!inputValue) return options;
      return options.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }, [inputValue, options]);

    const handleSelect = (optionValue: string | number) => {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
      setOpen(false);
    };

    const [controlledValue, setControlledValue] = React.useState("");

    return (
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={btnRef}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full px-3 py-2 h-auto"
            >
              {selectedValue
                ? options.find((item) => item.value === selectedValue)?.label
                : placeholder
                  ? placeholder
                  : "Select..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="p-0"
            style={{
              width: btnRef.current?.offsetWidth ?? undefined,
            }}
          >
            <Command>
              <div className="flex items-center border-b px-3">
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  name={name}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder ? placeholder : "Select..."}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <List
                  options={filtered}
                  setOpen={setOpen}
                  value={[controlledValue, setControlledValue]}
                  handleSelect={handleSelect}
                />
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
    );
  }
);

VirtualizerCombobox.displayName = "VirtualizerCombobox";