"use client";

import { forwardRef } from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import type { Option } from "./radio-group-field";
import { FormControl } from "./react-hook-form";
import { InfiniteCombobox } from "../ui/Infinite-combobox";
import React from "react";

interface InfiniteComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field?: ControllerRenderProps<TFieldValues, TName>;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  className?: string;
  fetchItems: (params: {
    pageParam: number;
    search: string;
    limit?: number;
  }) => Promise<{
    items: Option[];
    nextOffset?: number | null;
  }>;
  queryKey?: string;
}

export const InfiniteComboboxField = forwardRef<
  HTMLButtonElement,
  InfiniteComboboxFieldProps
>(
  (
    {
      field,
      placeholder = "Select item...",
      searchPlaceholder = "Search...",
      multiple = false,
      clearable = false,
      className,
      fetchItems,
      queryKey,
      ...props
    },
    ref
  ) => {
    const fieldQueryKey =
      queryKey || (field?.name ? `field-${field.name}` : undefined);
    return (
      <FormControl>
        <InfiniteCombobox
          ref={ref}
          value={field?.value}
          onChange={field?.onChange}
          onBlur={field?.onBlur}
          name={field?.name}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          multiple={multiple}
          clearable={clearable}
          className={className}
          fetchItems={fetchItems}
          queryKey={fieldQueryKey}
          {...props}
        />
      </FormControl>
    );
  }
);

InfiniteComboboxField.displayName = "InfiniteComboboxField";
