import { useContext } from "react";
import { CourseContext } from "./Context";

export const useCourse = () => {
  const courseContext = useContext(CourseContext);
  if (!courseContext)
    throw new Error("useCourse has to be used within <CourseContext>");
  return courseContext;
};