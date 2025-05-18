import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const EducationInstitutionRoute = createRoute(
    {
        path: "/education-institution",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/EducationInstitution"))
    })
export default [EducationInstitutionRoute]