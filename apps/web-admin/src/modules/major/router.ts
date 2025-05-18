import { appLayoutRoute } from "@/layouts/AppLayout";

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";


export const MajorRoute = createRoute(
    {
        path: "/major",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/MajorPage"))

    }
)

export default [MajorRoute]