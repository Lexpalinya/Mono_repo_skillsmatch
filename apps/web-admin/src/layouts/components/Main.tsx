import { cn } from "@skillsmatch/ui";
import React from "react";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        "peer-[.header-fixed]/header:mt-16",
        "px-4 py-2",
        fixed && "fixed-main flex grow flex-col overflow-hidden"
      )}
      {...props}
    />
  );
};

Main.displayName = "Main";
