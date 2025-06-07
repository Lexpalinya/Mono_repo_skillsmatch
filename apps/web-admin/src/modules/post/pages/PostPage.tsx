import { Main } from "@/layouts/components/Main";
import PostProvider from "../context/Provider";
import PostStatsCards from "../components/PostStatsCard";
import { Button } from "@skillsmatch/ui";
import { PlusCircle } from "lucide-react";
import { usePost } from "../context/usePost";
import { PostTable } from "../components/table/Table";
import PostDialog from "../components/dialog/PostDialog";

export default function PostPage() {
  return (
    <PostProvider>
      <PostContent />
      <PostDialog />
    </PostProvider>
  );
}

export const PostContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Post Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all posts in the system
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <PostStatsCards />
    <PostTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = usePost();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Post
    </Button>
  );
};
