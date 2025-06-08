import { useContext } from "react";
import { ReViewApplicationContext } from "./Context";

export const useReviewApplication = () => {
  const reviewApplicationContext = useContext(ReViewApplicationContext);
  if (!reviewApplicationContext)
    throw new Error(
      "ReviewApplication has to be used within <ReviewApplicationContext>"
    );
  return reviewApplicationContext;
};
