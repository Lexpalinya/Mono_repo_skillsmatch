import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const MemberRoute = createRoute(
    {
        path: "/member",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/MemberPage"))

    }
)

export default [MemberRoute]