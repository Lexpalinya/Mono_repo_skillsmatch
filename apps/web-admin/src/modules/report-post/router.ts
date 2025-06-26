import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const reportpostRoute = createRoute({
  path: "/report-post",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/ReportPostPage")),
});

export default [reportpostRoute];
