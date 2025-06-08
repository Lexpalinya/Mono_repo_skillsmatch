import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@skillsmatch/ui";

import { DialogTitle } from "@radix-ui/react-dialog";
import { formatDateTime } from "@/utils/formatDateTime";
import { useReviewApplication } from "../../context/useReviewApplication";
import type { IReviewApplicationCurrentRowProps } from "../../utils/type";
import { Calendar, Star, User } from "lucide-react";

export default function View({
  open,
  currentRow,
}: Readonly<IReviewApplicationCurrentRowProps>) {
  const { setOpen } = useReviewApplication();

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            View detailed information about this currentRow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
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
                <span className="font-medium">
                  {currentRow.member.username}
                </span>
              </div>
              <Badge variant="outline" className="mt-1">
                {currentRow.member.role}
              </Badge>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <h4 className="font-medium">Rating</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < currentRow.score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {currentRow.score}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <h4 className="font-medium">Comment</h4>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">{currentRow.comment}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <div className="font-medium">Created</div>
                <div>{formatDateTime(currentRow.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <div className="font-medium">Updated</div>
                <div>{formatDateTime(currentRow.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
