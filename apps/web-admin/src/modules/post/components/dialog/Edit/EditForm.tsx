// components/CompanyForm.tsx
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
import {
  PostFileUpdateDto,
  type IPostAdminViewDtoType,
  type IPostFileUpdateDtoType,
} from "@skillsmatch/dto";

import trpcClient from "@/libs/trpc-client";
import { extractChangedFields } from "@/utils/extractChangedFields";

import { businessModelComboboxService } from "@/modules/service/combobox/business-model";
import { usePost } from "@/modules/post/context/usePost";

interface PostFormProps {
  readonly open: boolean;
  readonly initialData: Partial<IPostAdminViewDtoType>;
}

export default function EditForm({ open, initialData }: PostFormProps) {
  const form = useForm({
    resolver: zodResolver(PostFileUpdateDto),
    values: {
      ...initialData,
    },
  });

  const {
    tableQuery: { refetch },
    setOpen,
    resetPostState,
  } = usePost();

  const onSubmit = async (values: IPostFileUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(initialData, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }
      if (Array.isArray(changedFields.image)) {
        const uploadedUrls = await Promise.all(
          changedFields.image.map(async (fileOrUrl) => {
            return fileOrUrl instanceof File
              ? await uploadImageToCloudinary(fileOrUrl)
              : fileOrUrl;
          })
        );
        changedFields.image = uploadedUrls;
      }

      await trpcClient.jobber.update.mutate({
        id: initialData.id ?? "",
        ...changedFields,
        image:
          Array.isArray(changedFields.image) &&
          changedFields.image[0] instanceof File
            ? []
            : (changedFields.image as string[]),
      });
      resetPostState();
      refetch();

      toast.success("Company updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
      setOpen(null);
    } catch (error) {
      confirm({
        actionText: "Retry",
        title: "Failed to Update Company",
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
      title="Edit Company"
      description="Update the details for this company."
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <FormDialog.Field name="name" label="Company Name">
            <FormDialog.InputGroup.Input />
          </FormDialog.Field>
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="owner_firstname" label="Owner First Name">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="owner_lastname" label="Owner Last Name">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="taxPayId" label="Tax Pay ID">
              <FormDialog.InputGroup.Input />
            </FormDialog.Field>
            <FormDialog.Field name="dob" label="Date of Birth">
              <FormDialog.InputGroup.DatePicker />
            </FormDialog.Field>
          </div>
          <FormDialog.Field name="bmId" label="Business Model">
            <FormDialog.InputGroup.InfiniteCombobox
              placeholder="Select Business Model"
              fetchItems={async ({ pageParam, search, limit = 10 }) =>
                businessModelComboboxService({ pageParam, search, limit })
              }
            />
          </FormDialog.Field>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 pt-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Birth Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormDialog.Field name="province" label="Province">
                <FormDialog.InputGroup.Input placeholder="e.g. Vientiane Capital" />
              </FormDialog.Field>
              <FormDialog.Field name="district" label="District">
                <FormDialog.InputGroup.Input placeholder="e.g. Saythany" />
              </FormDialog.Field>
              <FormDialog.Field name="village" label="Village">
                <FormDialog.InputGroup.Input placeholder="e.g. Dongdok" />
              </FormDialog.Field>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 pt-4">
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

          <p className="text-sm text-muted-foreground">
            Link this company to an existing member account
          </p>
          <FormDialog.Field name="reason" label="Notes/Reason">
            <FormDialog.InputGroup.Input placeholder="Any additional notes about this company" />
          </FormDialog.Field>
          <FormDialog.Field name="image" label="Document Image">
            <FormDialog.InputGroup.ImageInputMulti />
          </FormDialog.Field>
        </TabsContent>
      </Tabs>
    </FormDialog>
  );
}
