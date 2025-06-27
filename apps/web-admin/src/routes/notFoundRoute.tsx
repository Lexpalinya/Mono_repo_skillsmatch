import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  loader: () => {
    throw redirect({ to: "/auth/login", replace: true });
  },
});
