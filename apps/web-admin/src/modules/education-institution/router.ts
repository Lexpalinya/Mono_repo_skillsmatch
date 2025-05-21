import { appLayoutRoute } from "@/layouts/AppLayout";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const educationalInstitutionRoute = createRoute(
    {
        path: "/education-institution",
        getParentRoute: () => appLayoutRoute,
        component: lazyRouteComponent(() => import("./pages/EducationInstitution"))
    })
export default [educationalInstitutionRoute]