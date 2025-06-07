import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  controls?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onChange,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      controls = true,
      formatOptions,
      className,
      inputClassName,
      buttonClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      value !== undefined ? value.toString() : ""
    );

    // Update internal value when prop value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value.toString());
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Allow empty input or valid numbers
      if (newValue === "" || !isNaN(Number(newValue))) {
        setInternalValue(newValue);

        // Only call onChange if the value is a valid number
        if (newValue !== "" && onChange) {
          const numericValue = Number(newValue);
          onChange(numericValue);
        }
      }
    };

    const handleBlur = () => {
      if (internalValue === "") {
        // If empty, set to min value
        setInternalValue(min.toString());
        onChange?.(min);
        return;
      }

      let numericValue = Number(internalValue);

      // Clamp value between min and max
      if (numericValue < min) {
        numericValue = min;
      } else if (numericValue > max) {
        numericValue = max;
      }

      setInternalValue(numericValue.toString());
      onChange?.(numericValue);
    };

    const increment = () => {
      const currentValue =
        internalValue === "" ? min - step : Number(internalValue);
      const newValue = Math.min(currentValue + step, max);
      setInternalValue(newValue.toString());
      onChange?.(Number(newValue.toFixed(1)));
    };

    const decrement = () => {
      const currentValue =
        internalValue === "" ? min + step : Number(internalValue);
      const newValue = Math.max(currentValue - step, min);
      setInternalValue(newValue.toString());
      onChange?.(Number(newValue.toFixed(1)));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
    };

    return (
      <div className={cn("flex items-center", className)}>
        {controls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("h-9 w-9 rounded-r-none", buttonClassName)}
            onClick={decrement}
            disabled={disabled || Number(internalValue) <= min}
            aria-label="Decrease value"
            tabIndex={-1}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          ref={ref}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background transition-all px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            controls && "rounded-none",
            inputClassName
          )}
          {...props}
        />
        {controls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("h-9 w-9 rounded-l-none", buttonClassName)}
            onClick={increment}
            disabled={disabled || Number(internalValue) >= max}
            aria-label="Increase value"
            tabIndex={-1}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

InputNumber.displayName = "InputNumber";
