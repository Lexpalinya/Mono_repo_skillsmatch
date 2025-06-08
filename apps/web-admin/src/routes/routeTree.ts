import { rootRoute } from "./__root";
import { appLayoutRoute } from "@/layouts/AppLayout";
import loginRoute from "@/modules/auth/login/router";
import memberRoute from "@/modules/member/router";
import jobberRoute from "@/modules/jobber/router";
import companyRoute from "@/modules/company/router";
import postRoute from "@/modules/post/router";
import educationLevelRouter from "@/modules/education-level/router";
import educationInstitutionRoute from "@/modules/education-institution/router";
import majorRoute from "@/modules/major/router";
import courseRoute from "@/modules/course/router";
import jobPositionRouter from "@/modules/job-position/router";
import businessModel from "@/modules/business-model/router";
import skillRoute from "@/modules/skill/router";

import jobberStatusRoute from "@/modules/jobber-status/router";
import reviewApplicationRoute from "@/modules/review-application/router";
const routeTree = rootRoute.addChildren([
  ...loginRoute,
  appLayoutRoute.addChildren([
    ...memberRoute,
    ...jobberRoute,
    ...companyRoute,
    ...postRoute,
    ...educationLevelRouter,
    ...educationInstitutionRoute,
    ...majorRoute,
    ...courseRoute,
    ...jobPositionRouter,
    ...businessModel,
    ...skillRoute,
    ...jobberStatusRoute,
    ...reviewApplicationRoute,
  ]),
]);

export default routeTree;
