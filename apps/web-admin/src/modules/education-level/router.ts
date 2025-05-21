import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const educationLevelRoute = createRoute({
  path: "/education-level",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/EducationLevel")),
});

export default [educationLevelRoute];
