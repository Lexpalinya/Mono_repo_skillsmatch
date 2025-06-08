import { memberComboboxService } from "@/service/combobox/member";
import type { IReviewAdminDtoType } from "@skillsmatch/dto";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  FormDialog,
  Label,
} from "@skillsmatch/ui";
import { Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { FieldValues, Path, PathValue, useForm } from "react-hook-form";

const ReviewApplicationForm = <T extends FieldValues>({
  open,
  setOpen,
  form,
  onSubmit,
  title,
  description,
  currentRow,
}: {
  open: boolean;
  setOpen: (value: null | boolean) => void;
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (values: T) => Promise<void>;
  title?: string;
  description?: string;
  currentRow?: IReviewAdminDtoType;
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(form.getValues("score" as Path<T>) || 5);

  // ✅ Register score field on mount
  useEffect(() => {
    form.register("score" as Path<T>);
    form.setValue("score" as Path<T>, rating as PathValue<T, Path<T>>);
  }, []);

  // ✅ Update score in react-hook-form when rating changes
  const handleStarClick = (value: number) => {
    setRating(value);
    form.setValue("score" as Path<T>, value as PathValue<T, Path<T>>);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={() => {
        setOpen(null);
      }}
      classNameDialog="w-[350px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={title ?? "Edit Review Application"}
      description={
        description ?? "Make changes to the review. Click save when you're done"
      }
    >
      {!currentRow && (
        <FormDialog.Field name="memberId" label="Member Account">
          <FormDialog.InputGroup.InfiniteCombobox
            placeholder="Select Member Account"
            fetchItems={async ({ pageParam, search, limit = 10 }) =>
              memberComboboxService({ pageParam, search, limit })
            }
          />
        </FormDialog.Field>
      )}
      {currentRow && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={currentRow.member.profile || "/placeholder.svg"}
              alt={currentRow.member.username}
            />
            <AvatarFallback>
              {currentRow.member.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{currentRow.member.username}</span>
            </div>
            <Badge variant="outline" className="mt-1">
              {currentRow.member.role}
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starIndex = i + 1;
            return (
              <Star
                key={i}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  starIndex <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-200"
                }`}
                onClick={() => handleStarClick(starIndex)}
                onMouseEnter={() => setHoveredRating(starIndex)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            );
          })}
          <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
        </div>
        {/* Optional hidden field to ensure it's registered (for debugging / dev tools) */}
        <input
          type="hidden"
          {...form.register("score" as Path<T>)}
          value={rating}
        />
      </div>
      <FormDialog.Field name="comment" label="Comment">
        <FormDialog.InputGroup.Textarea placeholder="Enter your review comment..." />
      </FormDialog.Field>
    </FormDialog>
  );
};

export default ReviewApplicationForm;
