import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";

const loginRoute = createRoute({
  path: "/auth/login",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./Login")),
});
export default [loginRoute];
