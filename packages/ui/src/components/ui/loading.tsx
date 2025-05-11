import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";
import React from "react";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex justify-center items-center h-screen", className)}>
      <Spinner size="large">Loading...</Spinner>
    </div>
  );
};

export { Loading };