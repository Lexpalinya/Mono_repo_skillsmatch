// containers/EditForm.tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import trpcClient from "@/libs/trpc-client";

import EditForm from "./EditForm";
import type { ICompanyCurrentRowProps } from "@/modules/company/utils/type";
import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";

export default function Edit({ open, currentRow }: ICompanyCurrentRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["CompanyDetail", currentRow.id],
    queryFn: async (): Promise<ICompanyAdminViewDtoType> => {
      return await trpcClient.company.getById.query({ id: currentRow.id });
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading || !data) return null;
  if (error) throw error;

  return <EditForm open={open} initialData={data} />;
}
