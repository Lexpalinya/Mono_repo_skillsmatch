import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const SkillRoute = createRoute({
  path: "/business-model",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/BusinessModel")),
});

export default [SkillRoute];
