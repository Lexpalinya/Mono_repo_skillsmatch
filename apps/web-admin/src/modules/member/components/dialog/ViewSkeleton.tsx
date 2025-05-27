import { DialogDescription } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from "@skillsmatch/ui";

export default function ViewSkeleton() {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          <Skeleton className="h-6 w-48" />
        </DialogTitle>
        <DialogDescription>
          <Skeleton className="h-4 w-64 mt-2" />
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-1 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <Skeleton className="h-6 w-28 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Status Information */}
          <div>
            <Skeleton className="h-6 w-28 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Account Information */}
        <div>
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <DialogFooter>
        <Skeleton className="h-8 w-20" />
      </DialogFooter>
    </DialogContent>
  );
}
