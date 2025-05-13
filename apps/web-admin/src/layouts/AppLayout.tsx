import { rootRoute } from "@/routes/__root";
import { cn, UnauthorizedError } from "@skillsmatch/ui";
import { createRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { SiteHeader } from "./components/site-header";

export const appLayoutRoute = createRoute({
  path: "/app",
  getParentRoute: () => rootRoute,
  component: () => AppLayout(),
});

const AppLayout = () => {
  const router = useRouter();
  const navigate = useNavigate();
  if (true)
    <UnauthorizedError
      onBack={() => router.history.back()}
      onGoLogin={() => navigate({ to: "/auth/login" })}
    />;

  return (
    <div
      id="content"
      className={cn(
        "ml-auto w-full max-w-full border-1 m-2 shadow rounded-3xl bg-card",
        "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
        "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
        "sm:transition-[width] sm:duration-200 sm:ease-linear",
        "flex flex-col",
        "group-data-[scroll-locked=1]/body:h-full",
        "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
      )}
    >
      {/* <SiteHeader /> */}
      <Outlet />
    </div>
  );
};
