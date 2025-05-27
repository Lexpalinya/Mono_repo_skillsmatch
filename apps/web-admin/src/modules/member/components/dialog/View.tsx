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
import { formatDate } from "@/utils/formatDateTime";
import { useMember } from "../../context/useMember";
import type { IMemberCurrentRowProps } from "../../utils/type";
import { UserRound } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import trpcClient from "@/libs/trpc-client";
import type { IMemberAdminViewDtoType } from "@skillsmatch/dto";
import ViewSkeleton from "./ViewSkeleton";

function InfoRow({
  label,
  children,
  cols = 2,
}: {
  label: string;
  children: React.ReactNode;
  cols?: number;
}) {
  return (
    <div className={`grid grid-cols-${cols} gap-1`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className={`col-span-${cols - 1} text-sm`}>{children}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium">{title}</h4>
      <div className="space-y-2 rounded-lg border p-3">{children}</div>
    </div>
  );
}

export default function View({ open, currentRow }: IMemberCurrentRowProps) {
  const { setOpen } = useMember();

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberDetail", currentRow.id],
    queryFn: async (): Promise<IMemberAdminViewDtoType> => {
      return await trpcClient.member.getById.query({
        id: currentRow.id,
      });
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading)
    return (
      <Dialog open={open} onOpenChange={() => setOpen(null)}>
        <ViewSkeleton />
      </Dialog>
    );
  if (error) return null;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Detailed information about this data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="relative w-full mb-16">
            <div className="">
              <img
                src={data?.background ?? ""}
                alt={data?.username}
                className="object-cover h-32 w-full"
              />
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                  {data?.profile ? (
                    <img
                      src={data?.profile || "/placeholder.svg"}
                      alt={data?.username}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {data?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{data?.username}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Basic Information</h4>
              <div className="space-y-2 rounded-lg border p-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Phone:
                  </span>
                  <span className="col-span-2 text-sm">
                    {data?.phoneNumber}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Role:
                  </span>
                  <div className="col-span-2">
                    <Badge
                      variant={
                        data?.role === "admin"
                          ? "destructive"
                          : data?.role === "company"
                            ? "outline"
                            : data?.role === "jobber"
                              ? "secondary"
                              : "default"
                      }
                    >
                      {data?.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Status Information</h4>
              <div className="space-y-2 rounded-lg border p-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Block:
                  </span>
                  <div className="col-span-2">
                    <Badge variant={data?.block ? "destructive" : "outline"}>
                      {data?.block ? "Blocked" : "Not Blocked"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Visibility:
                  </span>
                  <div className="col-span-2">
                    <Badge variant={data?.visible ? "default" : "secondary"}>
                      {data?.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Account Information</h4>
            <div className="space-y-2 rounded-lg border p-3">
              <div className="grid grid-cols-6 gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Created:
                </span>
                <span className="col-span-2 text-sm">
                  {data?.createdAt ? formatDate(data.createdAt) : "-"}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Updated:
                </span>
                <span className="col-span-2 text-sm">
                  {data?.updatedAt ? formatDate(data.updatedAt) : "-"}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Login Version:
                </span>
                <span className="col-span-2 text-sm">{data?.loginVersion}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  Has Jobber:
                </span>
                <span className="col-span-2 text-sm">
                  {data?.Jobber ? "Yes" : "No"}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Has Company:
                </span>
                <span className="col-span-5 text-sm">
                  {data?.Company ? "Yes" : "No"}
                </span>
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
