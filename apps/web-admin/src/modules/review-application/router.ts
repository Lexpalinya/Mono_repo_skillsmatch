import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const reviewApplicationRoute = createRoute({
  path: "/review-application",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/ReviewApplicationPage")),
});

export default [reviewApplicationRoute];
