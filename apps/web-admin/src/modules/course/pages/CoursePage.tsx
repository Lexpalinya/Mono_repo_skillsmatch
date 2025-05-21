import { Button } from "@skillsmatch/ui";
import CourseDialog from "../components/dialog/CourseDialog";
import CourseStatsCard from "../components/CourseStatsCard";
import { CourseTable } from "../components/table/Table";
import CourseProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useCourse } from "../context/useCourse";

export default function CoursePage() {
  return (
    <CourseProvider>
      <CourseContent />
      <CourseDialog />
    </CourseProvider>
  );
}

export const CourseContent = () => (
  <Main>
    <div className="flex items-center justify-between ">
      <div>
        <h1 className="text-2xl font-semibold">Courses Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage courses for training
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <CourseStatsCard />
    <CourseTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useCourse();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Course
    </Button>
  );
};
