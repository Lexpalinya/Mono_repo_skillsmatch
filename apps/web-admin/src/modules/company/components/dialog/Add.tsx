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

import { useCompany } from "../../context/useCompany";
import {
  CompanyFileCreateDTO,
  type ICompanyFileCreateDTOType,
} from "@skillsmatch/dto";
import { memberCompanyComboboxService } from "@/modules/service/combobox/member";
import { businessModelComboboxService } from "@/modules/service/combobox/bussiness-model";
import { uploadImageToCloudinary } from "@skillsmatch/config";

export default function AddCompany({ open }: Readonly<{ open: boolean }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetCompanyState,
  } = useCompany();

  const form = useForm<ICompanyFileCreateDTOType>({
    resolver: zodResolver(CompanyFileCreateDTO),
  });

  const onSubmit = async (values: ICompanyFileCreateDTOType) => {
    try {
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

      await trpcClient.company.create.mutate({
        ...values,
        docImage:
          Array.isArray(values.docImage) &&
          values.docImage.every((item) => typeof item === "string")
            ? values.docImage
            : [],
      });
      resetCompanyState();
      form.reset();
      refetch();

      toast.success("Company created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      confirm({
        actionText: "Retry",
        title: "Failed to Create Company",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the company. Please try again.",
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
      title="Create New Company"
      description="Fill in the details below to create a new company."
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
            <FormDialog.Field name="taxPayId" label="tax Pay Id">
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
                  memberCompanyComboboxService({ pageParam, search, limit })
                }
              />
            </FormDialog.Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Link this company to an existing member account
          </p>
          <FormDialog.Field name="reason" label="Notes/Reason">
            <FormDialog.InputGroup.Input placeholder="Any additional notes about this company" />
          </FormDialog.Field>
          <FormDialog.Field name="docImage" label="Document Image">
            <FormDialog.InputGroup.ImageInputMulti />
          </FormDialog.Field>
        </TabsContent>
      </Tabs>
    </FormDialog>
  );
}
