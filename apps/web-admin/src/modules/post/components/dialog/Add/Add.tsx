import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle, Plus, X } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import {
  Button,
  Card,
  confirm,
  FormDialog,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skillsmatch/ui";

import {
  PostFileCreateDto,
  type IPostFileCreateDtoType,
} from "@skillsmatch/dto";

import { uploadImageToCloudinary } from "@skillsmatch/config";

import { companyComboboxService } from "@/modules/service/combobox/company";

import { courseComboboxService } from "@/modules/service/combobox/course";
import { majorComboboxService } from "@/modules/service/combobox/major";
import { educationLevelComboboxService } from "@/modules/service/combobox/education-level";
import { educationInstitutionComboboxService } from "@/modules/service/combobox/educational-institution";
import { jobPositionComboboxService } from "@/modules/service/combobox/job-position";
import { usePost } from "@/modules/post/context/usePost";
import { workdays } from "@/modules/post/utils/workday";
import { optionCurrency } from "@/modules/post/utils/option";

export default function AddCompany({ open }: Readonly<{ open: boolean }>) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetPostState,
  } = usePost();

  const form = useForm<IPostFileCreateDtoType>({
    resolver: zodResolver(PostFileCreateDto),
  });
  const {
    fields: jobFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "jobPositions",
  });

  const onSubmit = async (values: IPostFileCreateDtoType) => {
    try {
      if (Array.isArray(values.image) && values.image[0] instanceof File) {
        const uploadedUrls = await Promise.all(
          values.image
            .filter((file): file is File => file instanceof File)
            .map((file) => uploadImageToCloudinary(file))
        );
        values.image = uploadedUrls;
      }

      form.setValue("image", values.image);

      await trpcClient.post.create.mutate({
        ...values,
        image:
          Array.isArray(values.image) &&
          values.image.every((item) => typeof item === "string")
            ? values.image
            : [],
      });
      resetPostState();
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Pay</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="positions">Job Positions</TabsTrigger>
          <TabsTrigger value="media">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="title" label="Job Title">
              <FormDialog.InputGroup.Input placeholder="e.g. Software Engineer Intern" />
            </FormDialog.Field>
            <FormDialog.Field name="cId" label="Company">
              <FormDialog.InputGroup.InfiniteCombobox
                placeholder="Select Company"
                fetchItems={async ({ pageParam, search, limit = 10 }) =>
                  companyComboboxService({ pageParam, search, limit })
                }
              />
            </FormDialog.Field>
          </div>
          <FormDialog.Field name="welfare" label="Welfare & Benefits">
            <FormDialog.InputGroup.Textarea placeholder="e.g. Free lunch, health insurance, flexible hours" />
          </FormDialog.Field>
          <FormDialog.Field name="more" label="Welfare & Benefits">
            <FormDialog.InputGroup.Textarea placeholder="e.g. Opportunity to work with a passionate engineering team" />
          </FormDialog.Field>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <FormDialog.Field name="currency" label="Currency">
              <FormDialog.InputGroup.Select options={optionCurrency} />
            </FormDialog.Field>
            <FormDialog.Field name="minSalary" label="Minimum Salary">
              <FormDialog.InputGroup.InputNumberField controls={false} />
            </FormDialog.Field>
            <FormDialog.Field name="maxSalary" label="Maximum Salary">
              <FormDialog.InputGroup.InputNumberField controls={false} />
            </FormDialog.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="checkInTime" label="Check-in Time">
              <FormDialog.InputGroup.TimePicker />
            </FormDialog.Field>
            <FormDialog.Field name="checkOutTime" label="Check-out Time">
              <FormDialog.InputGroup.TimePicker />
            </FormDialog.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormDialog.Field name="gpa" label="Minimum GPA">
              <FormDialog.InputGroup.InputNumberField
                controls={true}
                max={4}
                min={0}
                step={0.1}
              />
            </FormDialog.Field>
            <FormDialog.Field name="endDate" label="End Date">
              <FormDialog.InputGroup.DatePicker />
            </FormDialog.Field>
          </div>
          <FormDialog.Field name="workdays" label="Workdays">
            <FormDialog.InputGroup.Checkbox
              className="grid grid-cols-4 gap-4"
              options={workdays}
            />
          </FormDialog.Field>
        </TabsContent>
        <TabsContent value="requirements" className="space-y-4">
          <FormDialog.Field name="courseIds" label="Required Courses">
            <FormDialog.InputGroup.InfiniteCombobox
              multiple={true}
              fetchItems={async ({ pageParam, search, limit = 10 }) =>
                courseComboboxService({ pageParam, search, limit })
              }
            />
          </FormDialog.Field>
          <FormDialog.Field name="majorIds" label="Required Majors">
            <FormDialog.InputGroup.InfiniteCombobox
              multiple={true}
              fetchItems={async ({ pageParam, search, limit = 10 }) =>
                majorComboboxService({ pageParam, search, limit })
              }
            />
          </FormDialog.Field>
          <FormDialog.Field
            name="educationLevelIds"
            label="Required Education Levels"
          >
            <FormDialog.InputGroup.InfiniteCombobox
              multiple={true}
              fetchItems={async ({ pageParam, search, limit = 10 }) =>
                educationLevelComboboxService({ pageParam, search, limit })
              }
            />
          </FormDialog.Field>
          <FormDialog.Field
            name="educationInstitutionIds"
            label="Preferred Education Institutions"
          >
            <FormDialog.InputGroup.InfiniteCombobox
              multiple={true}
              fetchItems={async ({ pageParam, search, limit = 10 }) =>
                educationInstitutionComboboxService({
                  pageParam,
                  search,
                  limit,
                })
              }
            />
          </FormDialog.Field>
        </TabsContent>
        <TabsContent value="positions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Job Position Details</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ jpId: "", description: "", skillIds: [], amount: 1 })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </div>
          <ScrollArea className="max-h-[350px] overflow-y-auto pr-2">
            {jobFields.map((field, index) => (
              <Card key={field.id} className="p-4 mb-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Position {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormDialog.Field
                    name={`jobPositions.${index}.jpId`}
                    label="Position"
                  >
                    <FormDialog.InputGroup.InfiniteCombobox
                      fetchItems={async ({ pageParam, search, limit = 10 }) =>
                        jobPositionComboboxService({
                          pageParam,
                          search,
                          limit,
                        })
                      }
                    />
                  </FormDialog.Field>
                  <FormDialog.Field
                    name={`jobPositions.${index}.amount`}
                    label="Amount"
                  >
                    <FormDialog.InputGroup.InputNumberField min={1} />
                  </FormDialog.Field>
                </div>
                <FormDialog.Field
                  name={`jobPositions.${index}.description`}
                  label="Description"
                >
                  <FormDialog.InputGroup.Textarea placeholder="Responsibilities, qualifications, etc." />
                </FormDialog.Field>
                <FormDialog.Field
                  name={`jobPositions.${index}.skillIds`}
                  label="Required Skills"
                >
                  <FormDialog.InputGroup.InfiniteCombobox
                    fetchItems={async ({ pageParam, search, limit = 10 }) =>
                      jobPositionComboboxService({
                        pageParam,
                        search,
                        limit,
                      })
                    }
                  />
                </FormDialog.Field>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="media" className="space-y-4">
          <ScrollArea className="max-h-[350px] overflow-y-auto pr-2">
            <FormDialog.Field name="image" label="Post Images">
              <FormDialog.InputGroup.ImageInputMulti />
            </FormDialog.Field>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </FormDialog>
  );
}
