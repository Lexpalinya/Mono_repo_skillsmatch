import { useContext } from "react";
import { PostContext } from "./Context";

export const usePost = () => {
  const postContext = useContext(PostContext);
  if (!postContext)
    throw new Error("usePost must be used within <PostProvider>");
  return postContext;
};
