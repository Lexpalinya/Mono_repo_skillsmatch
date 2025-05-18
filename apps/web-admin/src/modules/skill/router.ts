import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const skillRoute = createRoute({
  path: "/skill",
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() => import("./pages/SkillPage")),
});

export default [skillRoute];
