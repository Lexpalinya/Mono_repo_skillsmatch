import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";



export const companyRoute = createRoute({
    path: "/company",
    getParentRoute: () => appLayoutRoute,
    component: lazyRouteComponent(() => import("./pages/CompanyPage"))
})

export default [companyRoute]