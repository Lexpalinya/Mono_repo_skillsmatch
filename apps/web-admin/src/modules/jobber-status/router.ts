import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const jobberStatusRoute = createRoute({
  path: "/jobber-status",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/JobberStatusPage")),
});
export default [jobberStatusRoute];
