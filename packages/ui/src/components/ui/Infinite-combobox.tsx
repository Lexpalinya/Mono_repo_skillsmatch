import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useCallback,
  WheelEvent,
  MouseEvent,
} from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import type { Option } from "../form/radio-group-field";
import { useDebounceCallback } from "../hooks/use-debounce-callback";
import { cn } from "../../lib/utils";

type InfiniteComboboxProps = {
  value?: string | number | Array<string | number>;
  name?: string;
  onChange?: (
    value: string | number | Array<string | number>,
    label?: string | number | Array<string | number>
  ) => void;
  onBlur?: () => void;
  fetchItems: (params: {
    pageParam: number;
    search: string;
    limit?: number;
  }) => Promise<{
    items: Option[];
    nextOffset?: number | null;
  }>;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  className?: string;
  clearable?: boolean;
  queryKey?: string;
};

const InfiniteCombobox = forwardRef<HTMLButtonElement, InfiniteComboboxProps>(
  ({
    value,
    onChange,
    onBlur,
    fetchItems,
    placeholder = "Select item...",
    searchPlaceholder = "Search...",
    className,
    multiple = false,
    clearable = false,
    queryKey = "infinite-combobox",
    ...props
  }) => {
    const btnRef = useRef<HTMLButtonElement>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internalValue, setInternalValue] = useState<
      string | number | Array<string | number> | undefined
    >(undefined);
    const uniqueQueryKey = props.name ? `${queryKey}-${props.name}` : queryKey;
    const debounced = useDebounceCallback(setSearch, 500);

    const getActualValue = () => {
      return value !== undefined ? value : internalValue;
    };

    const getSelectedValues = () => {
      const actualValue = getActualValue();
      if (Array.isArray(actualValue)) {
        return actualValue;
      } else if (actualValue !== undefined && actualValue !== "") {
        return [actualValue];
      }
      return [];
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
        queryKey: [uniqueQueryKey, search],
        queryFn: ({ pageParam = 0 }) => fetchItems({ pageParam, search }),
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        initialPageParam: 0,
        enabled: open,
        placeholderData: keepPreviousData,
      });

    const allItems = data
      ? data.pages.flatMap((p) =>
          p.items.map((_item) => ({ ..._item, value: _item.value.toString() }))
        )
      : [];

    const listRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
      count: hasNextPage ? allItems.length + 1 : allItems.length,
      getScrollElement: () => listRef.current,
      estimateSize: () => 40,
      overscan: 5,
    });

    useEffect(() => {
      const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
      if (
        lastItem &&
        lastItem.index >= allItems.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }, [
      virtualizer.getVirtualItems(),
      allItems.length,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    ]);

    const selectedValues = getSelectedValues();
    const selectedItems = allItems.filter((item) =>
      selectedValues.includes(item.value)
    );
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const handleWheel = useCallback((e: WheelEvent) => {
      if (scrollContainerRef.current) {
        e.stopPropagation();
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    }, []);

 const handleSelect = (val: string | number) => {
  let newValue: Array<string | number>;
  let newLabels: Array<{ label: string; value: string | number }>;

  const currentValues = getSelectedValues();

  if (multiple) {
    newValue = currentValues.includes(val)
      ? currentValues.filter((v) => v !== val)
      : [...currentValues, val];
  } else {
    newValue = val === getActualValue() ? [] : [val];
    setOpen(false);
  }

  if (value === undefined) {
    setInternalValue(multiple ? newValue : newValue[0] ?? "");
  }

  // Get corresponding label(s)
  newLabels = allItems
    .filter((item) => newValue.includes(item.value))
    .map((item) => ({ label: item.label, value: item.value }));

  onChange?.(
    multiple ? newValue : newValue[0] ?? "",
    multiple ? newLabels.map((labelObj) => labelObj.label) : newLabels[0]?.label ?? undefined
  );
};

    const handleClear = (e: MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : "";
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen && onBlur) {
            onBlur();
          }
          if (newOpen) {
            setSearch("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={btnRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex gap-2 flex-wrap w-full justify-between text-sm h-fit",
              className
            )}
            {...props}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selectedItems.length > 0 ? (
                multiple ? (
                  selectedItems.map((item, idx) => (
                    <Badge key={idx}>{item.label}</Badge>
                  ))
                ) : (
                  selectedItems[0]?.label || placeholder
                )
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {clearable && selectedItems.length > 0 && (
                <X
                  className="h-4 w-4 opacity-70 hover:opacity-100 cursor-pointer"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: btnRef.current?.offsetWidth ?? undefined,
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={(search) => debounced(search)}
            />
            <CommandList
              ref={listRef}
              style={{ maxHeight: 300, overflow: "auto", position: "relative" }}
            >
              {isFetching && !isFetchingNextPage && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  Searching...
                </div>
              )}
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                <div
                  onWheel={handleWheel}
                  ref={scrollContainerRef}
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: "relative",
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const isLoaderRow = virtualRow.index > allItems.length - 1;
                    const item = allItems[virtualRow.index];
                    if (!item && !isLoaderRow) return null;
                    const itemValue = item ? item.value : "";
                    const isSelected = selectedValues.includes(itemValue);
                    return (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {isLoaderRow ? (
                          <div className="px-2 py-2 text-sm text-muted-foreground">
                            {hasNextPage ? "Loading more..." : "No more items"}
                          </div>
                        ) : (
                          <CommandItem
                            value={item.value.toString()}
                            onSelect={() =>
                              handleSelect(item.value.toString())
                            }
                            className="aria-selected:bg-accent"
                            data-selected={isSelected}
                          >
                            {item.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

InfiniteCombobox.displayName = "InfiniteCombobox";

export { InfiniteCombobox };
