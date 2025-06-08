import { confirm, FormDialog } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { CompanyUpdateDto, type ICompanyUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompany } from "../../context/useCompany";
import type { ICompanyCurrentRowProps } from "../../utils/type";

export default function Verified({
  open,
  currentRow,
}: Readonly<ICompanyCurrentRowProps>) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetCompanyState,
  } = useCompany();
  const form = useForm<ICompanyUpdateDtoType>({
    defaultValues: {
      reason: currentRow.reason ?? undefined,
    },
    resolver: zodResolver(CompanyUpdateDto),
  });

  const onSubmit = async (values: ICompanyUpdateDtoType) => {
    try {
      await trpcClient.company.update.mutate({
        reason: values.reason,
        isVerify: !currentRow.isVerify,
        id: currentRow.id,
      });

      resetCompanyState();
      form.reset();
      refetch();

      toast.success("Company updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the skill. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Company",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={() => {
        setOpen(null);
      }}
      classNameDialog="sm:max-w-[750px]"
      formInstance={form}
      onSubmit={onSubmit}
      title={currentRow.isVerify ? "Revoke verification" : "Verify"}
      description={
        currentRow.isVerify
          ? "Revoke the verification status of this company."
          : "Verify this company to confirm their identity and information."
      }
    >
      <div className="space-y-2 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Company Information</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-muted-foreground">Name:</span>
          <span>{currentRow.name}</span>
          <span className="text-muted-foreground">Owner:</span>
          <span>
            {currentRow.owner_firstname} {currentRow.owner_lastname}
          </span>
          <span className="text-muted-foreground">Business Model:</span>
          <span>{currentRow.bm?.name}</span>
        </div>
      </div>

      <FormDialog.Field
        name="reason"
        label="Reason"
        description="You can optionally provide a note about this verification."
      >
        <FormDialog.InputGroup.Textarea
          placeholder={
            currentRow.isVerify
              ? "Provide a reason why you are revoking the verification status."
              : "Reason for verification"
          }
        />
      </FormDialog.Field>
    </FormDialog>
  );
}
