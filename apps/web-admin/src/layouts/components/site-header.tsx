import { cn, Separator, SidebarTrigger } from "@skillsmatch/ui";
import { useEffect, useState } from "react";
import { ThemeSwitch } from "./theme-switch";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export function SiteHeader({ className, fixed, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "flex h-16 items-center gap-3 p-4 sm:gap-4 rounded-t-3xl bg-card",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        className
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />

      <div className="ml-auto flex items-center space-x-4">
        <ThemeSwitch />
      </div>
    </header>
  );
}