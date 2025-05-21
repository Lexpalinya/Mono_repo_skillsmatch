import { useContext } from "react";
import { MajorContext } from "./Context";

export const useMajor = () => {
  const majorContext = useContext(MajorContext);
  if (!majorContext)
    throw new Error("Major has to be used within <MajorContext>");
  return majorContext;
};
