import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const courseRoute = createRoute({
    path: "/course",
    getParentRoute: () => appLayoutRoute,
    component: lazyRouteComponent(() => import("./pages/CoursePage"))
})
export default [courseRoute]