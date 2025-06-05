import { confirm, FormDialog } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { JobberUpdateDto, type IJobberUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJobber } from "../../context/useJobber";
import type { IJobberCurrentRowProps } from "../../utils/type";

export default function Verified({
  open,
  currentRow,
}: Readonly<IJobberCurrentRowProps>) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberState,
  } = useJobber();
  const form = useForm<IJobberUpdateDtoType>({
    defaultValues: {
      reason: currentRow.reason,
    },
    resolver: zodResolver(JobberUpdateDto),
  });

  const onSubmit = async (values: IJobberUpdateDtoType) => {
    try {
      await trpcClient.jobber.update.mutate({
        reason: values.reason,
        isVerify: !currentRow.isVerify,
        id: currentRow.id,
      });

      resetJobberState();
      form.reset();
      refetch();

      toast.success("Jobber updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the skill. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Jobber",
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
          ? "Revoke the verification status of this jobber."
          : "Verify this jobber to confirm their identity and information."
      }
    >
      <div className="space-y-2 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Jobber Information</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-muted-foreground">Name:</span>
          <span>
            {currentRow.firstName} {currentRow.lastName}
          </span>
          <span className="text-muted-foreground">Username:</span>
          <span>{currentRow.member?.username}</span>
          <span className="text-muted-foreground">Email:</span>
          <span>{currentRow.member?.email}</span>
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
