import * as React from "react";
import { cn } from "../../lib/utils";
import { Label } from "./label";
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from "./password-input";
import { FormDescription } from "./form-description";
import { FormMessage } from "./form-message";

interface PasswordFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, description, error, required, id, className, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-1">
        {label && (
          <Label htmlFor={inputId}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        <PasswordInput
          className={cn(
            "relative",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        >
          <PasswordInputInput
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : description
                  ? `${inputId}-desc`
                  : undefined
            }
            className={cn(className)}
            {...props}
          />
          <PasswordInputAdornmentToggle />
        </PasswordInput>

        {description && !error && (
          <FormDescription id={`${inputId}-desc`}>
            {description}
          </FormDescription>
        )}

        {error && <FormMessage id={`${inputId}-error`}>{error}</FormMessage>}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export { PasswordField };