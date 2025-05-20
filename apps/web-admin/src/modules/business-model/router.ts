import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const businessModelRoute = createRoute({
  path: "/business-model",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/BusinessModelPage")),
});

export default [businessModelRoute];
