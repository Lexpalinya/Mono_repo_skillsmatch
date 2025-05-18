import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const JobberRoute = createRoute(
    {
        path: "/jobber",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/JobberPage"))

    }
)

export default [JobberRoute]