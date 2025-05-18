import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const JobPositionRoute = createRoute(
    {
        path: "/job-position",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/JobPositionPage"))

    }
)

export default [JobPositionRoute]