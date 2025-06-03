// containers/EditForm.tsx
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";
import { uploadImageToCloudinary } from "@skillsmatch/config";
import { useJobber } from "../../../context/useJobber";

import type { IJobberCurrentRowProps } from "../../../utils/type";
import type { IJobberFileUpdateDtoType } from "@skillsmatch/dto";
import EditForm from "./EditForm";

export default function Edit({ open, currentRow }: IJobberCurrentRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["JobberDetail", currentRow.id],
    queryFn: () => trpcClient.jobber.getById.query({ id: currentRow.id }),
    placeholderData: keepPreviousData,
  });

  if (isLoading || !data) return null;
  if (error) throw error;

  return <EditForm open={open} initialData={data} />;
}
