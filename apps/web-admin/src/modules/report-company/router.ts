import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute ,lazyRouteComponent } from "@tanstack/react-router";

export const reportCompanyRoute = createRoute({
    path:"/report-company",
    getParentRoute: () => appLayoutRoute,
    component: lazyRouteComponent(() => import("./pages/reportCompanyPage"))
})

export default [reportCompanyRoute]