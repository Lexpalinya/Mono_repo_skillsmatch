// components/JobberForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

import {
  confirm,
  FormDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skillsmatch/ui";

import { uploadImageToCloudinary } from "@skillsmatch/config";
import type {
  IJobberAdminViewDto,
  IJobberFileUpdateDtoType,
} from "@skillsmatch/dto";
import { JobberFileUpdateDto } from "@skillsmatch/dto";
import { memberJobberComboboxService } from "@/service/combobox/member";
import { jobberStatusComboboxService } from "@/service/combobox/jobber-status";
import { useJobber } from "@/modules/jobber/context/useJobber";
import trpcClient from "@/libs/trpc-client";
import { extractChangedFields } from "@/utils/extractChangedFields";

interface JobberFormProps {
  open: boolean;

  initialData: Partial<IJobberAdminViewDto>;
}

export default function EditForm({ open, initialData }: JobberFormProps) {
  const form = useForm<IJobberFileUpdateDtoType>({
    resolver: zodResolver(JobberFileUpdateDto),
    values: {
      ...initialData,
    },
  });
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberState,
  } = useJobber();

  const onSubmit = async (values: IJobberFileUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(initialData, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      if (Array.isArray(changedFields.docImage)) {
        const uploadedUrls = await Promise.all(
          changedFields.docImage.map(async (fileOrUrl) => {
            return fileOrUrl instanceof File
              ? await uploadImageToCloudinary(fileOrUrl)
              : fileOrUrl;
          })
        );
        changedFields.docImage = uploadedUrls;
      }

      await trpcClient.jobber.update.mutate({
        id: initialData.id ?? "",
        ...changedFields,
        docImage:
          Array.isArray(changedFields.docImage) &&
          changedFields.docImage[0] instanceof File
            ? []
            : (changedFields.docImage as string[]),
      });

      resetJobberState();
      refetch();

      toast.success("Jobber updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
      setOpen(null);
    } catch (error) {
      confirm({
        actionText: "Retry",
        title: "Failed to Update Jobber",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
        CancelProps: { className: "hidden" },
      });
    }
  };
  return (
    <FormDialog
      formInstance={form}
      onSubmit={onSubmit}
      open={open}
      onOpenChange={() => setOpen(null)}
      title="Edit Jobber"
      description="Update the details for this job seeker."
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="firstName" label="First Name">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="lastName" label="Last Name">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="gender" label="Gender">
              <FormDialog.InputGroup.Select
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Transgender", value: "transgender" },
                ]}
              />
            </FormDialog.Field>
            <FormDialog.Field name="birthday" label="Date of Birth">
              <FormDialog.InputGroup.DatePicker />
            </FormDialog.Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormDialog.Field name="nationality" label="Nationality">
              <FormDialog.InputGroup.Input placeholder="e.g. Lao" />
            </FormDialog.Field>
            <FormDialog.Field name="ethnicity" label="Ethnicity">
              <FormDialog.InputGroup.Input placeholder="e.g. Lao" />
            </FormDialog.Field>
            <FormDialog.Field name="religion" label="Religion">
              <FormDialog.InputGroup.Input placeholder="e.g. Buddhism" />
            </FormDialog.Field>
          </div>
        </TabsContent>

        {/* Location */}
        <TabsContent value="location" className="space-y-4 pt-4">
          <h3 className="mb-2 text-sm font-medium">Birth Location</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormDialog.Field name="bProvince" label="Province">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="bDistrict" label="District">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="bVillage" label="Village">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
          </div>
          <h3 className="mb-2 text-sm font-medium">Current Location</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormDialog.Field name="cProvince" label="Province">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="cDistrict" label="District">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="cVillage" label="Village">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
          </div>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-medium">Member Account</h3>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {initialData.member?.username}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {initialData.member?.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {initialData.member?.phoneNumber}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Member account cannot be changed after creation.
              </p>
            </div>
            <FormDialog.Field name="statusId" label="Status">
              <FormDialog.InputGroup.InfiniteCombobox
                placeholder="Select Status"
                fetchItems={async ({ pageParam, search, limit = 10 }) =>
                  jobberStatusComboboxService({ pageParam, search, limit })
                }
              />
            </FormDialog.Field>
          </div>
          <FormDialog.Field name="reason" label="Notes/Reason">
            <FormDialog.InputGroup.Textarea />
          </FormDialog.Field>
          <FormDialog.Field name="docImage" label="Document Image">
            <FormDialog.InputGroup.ImageInputMulti />
          </FormDialog.Field>
        </TabsContent>
      </Tabs>
    </FormDialog>
  );
}
