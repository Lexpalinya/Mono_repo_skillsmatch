import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const reportmemberRoute = createRoute(
    {
        path: "/report-member",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/reportMemberPage"))

    }
)

export default [reportmemberRoute]