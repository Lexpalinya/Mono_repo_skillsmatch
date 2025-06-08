import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const postRoute = createRoute({
  path: "/post",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/PostPage")),
});

export default [postRoute];
