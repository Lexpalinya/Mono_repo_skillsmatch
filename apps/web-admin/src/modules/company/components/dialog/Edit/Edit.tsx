// containers/EditForm.tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import trpcClient from "@/libs/trpc-client";

import type { IJobberCurrentRowProps } from "../../../utils/type";

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
