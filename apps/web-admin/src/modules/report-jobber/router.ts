import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const reportjobberRoute = createRoute(
    {
        path: "/report-jobber",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/reportJobberPage"))

    }
)

export default [reportjobberRoute]