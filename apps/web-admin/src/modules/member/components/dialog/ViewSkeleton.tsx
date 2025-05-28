import {
  DialogContent,
  DialogTitle,
  Skeleton,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@skillsmatch/ui";

export default function ViewSkeleton() {
  return (
    <DialogContent className="">
      <DialogTitle>
        <div>
          <Skeleton className="h-6 w-48" />
        </div>
        <div>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </DialogTitle>

      <div className="flex flex-col gap-2 py-4">
        {/* Background Image Skeleton */}
        <div className="relative w-full mb-24">
          <Skeleton className="h-32 w-full" />
          <div className="absolute left-1/2 bottom-0 translate-x-[-40%] translate-y-2/3">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-muted border border-background">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
            <div className="text-center mt-2">
              <Skeleton className="h-5 w-32 mx-auto" />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Skeleton className="h-8 w-20" />
      </div>
    </DialogContent>
  );
}
