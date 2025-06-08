import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import {
  confirm,
  FormDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skillsmatch/ui";
import { useJobber } from "../../context/useJobber";

import { uploadImageToCloudinary } from "@skillsmatch/config";
import type { IJobberProps } from "../../utils/type";
import {
  JobberFileCreateDto,
  type IJobberFileCreateDtoType,
} from "@skillsmatch/dto";
import { memberJobberComboboxService } from "@/service/combobox/member";
import { jobberStatusComboboxService } from "@/service/combobox/jobber-status";

export default function Add({ open }: IJobberProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberState,
  } = useJobber();

  const form = useForm<IJobberFileCreateDtoType>({
    resolver: zodResolver(JobberFileCreateDto),
  });

  const onSubmit = async (values: IJobberFileCreateDtoType) => {
    try {
      // Upload if `docImage` is array of File
      if (
        Array.isArray(values.docImage) &&
        values.docImage[0] instanceof File
      ) {
        const uploadedUrls = await Promise.all(
          values.docImage
            .filter((file): file is File => file instanceof File)
            .map((file) => uploadImageToCloudinary(file))
        );
        values.docImage = uploadedUrls;
      }

      form.setValue("docImage", values.docImage);

      await trpcClient.jobber.create.mutate({
        ...values,
        docImage:
          Array.isArray(values.docImage) && values.docImage[0] instanceof File
            ? []
            : (values.docImage as string[]),
      });

      resetJobberState();
      form.reset();
      refetch();

      toast.success("Jobber created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the jobber. Please try again.";

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
      formInstance={form}
      onSubmit={onSubmit}
      open={open}
      onOpenChange={() => setOpen(null)}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

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
              <FormDialog.InputGroup.Input placeholder="e.g. buddhism" />
            </FormDialog.Field>
          </div>
        </TabsContent>
        <TabsContent value="location" className="space-y-4 pt-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Birth Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormDialog.Field name="bProvince" label="Province">
                <FormDialog.InputGroup.Input placeholder="e.g. Vientiane Capital" />
              </FormDialog.Field>
              <FormDialog.Field name="bDistrict" label="District">
                <FormDialog.InputGroup.Input placeholder="e.g. Saythany" />
              </FormDialog.Field>
              <FormDialog.Field name="bVillage" label="Village">
                <FormDialog.InputGroup.Input placeholder="e.g. dongdok" />
              </FormDialog.Field>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Current Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormDialog.Field name="cProvince" label="Province">
                <FormDialog.InputGroup.Input placeholder="e.g. Vientiane Capital" />
              </FormDialog.Field>
              <FormDialog.Field name="cDistrict" label="District">
                <FormDialog.InputGroup.Input placeholder="e.g. Saythany" />
              </FormDialog.Field>
              <FormDialog.Field name="cVillage" label="Village">
                <FormDialog.InputGroup.Input placeholder="e.g. dongdok" />
              </FormDialog.Field>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="account" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="memberId" label="Member Account">
              <FormDialog.InputGroup.InfiniteCombobox
                placeholder="Select Member Account"
                fetchItems={async ({ pageParam, search, limit = 10 }) =>
                  memberJobberComboboxService({ pageParam, search, limit })
                }
              />
            </FormDialog.Field>
            <FormDialog.Field name="statusId" label="Status">
              <FormDialog.InputGroup.InfiniteCombobox
                placeholder="Select Status"
                fetchItems={async ({ pageParam, search, limit = 10 }) =>
                  jobberStatusComboboxService({ pageParam, search, limit })
                }
              />
            </FormDialog.Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Link this jobber to an existing member account
          </p>
          <FormDialog.Field name="docImage" label="Document Image">
            <FormDialog.InputGroup.ImageInputMulti />
          </FormDialog.Field>
        </TabsContent>
      </Tabs>
    </FormDialog>
  );
}
