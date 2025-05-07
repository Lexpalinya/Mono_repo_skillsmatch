import { router } from "./lib/trpc";
import { businessModelRouter } from "./modules/business-model/router";
import { courseRouter } from "./modules/course/router";
import { educationalInstitutionRouter } from "./modules/education-institution/router";
import { educationLevelRouter } from "./modules/education-level/router";
import { jobPositionRouter } from "./modules/job-position/router";
import { majorRouter } from "./modules/major/router";
import { memberAuthRouter, memberRouter } from "./modules/member/router";
import { skillRouter } from "./modules/skill/router";


export const appRouter = router(
    {
        businessModel: businessModelRouter,
        course: courseRouter,
        educationLevel: educationLevelRouter,
        educationInstitution: educationalInstitutionRouter,
        jobPosition: jobPositionRouter,
        major: majorRouter,
        skill: skillRouter,
        member: memberRouter,
        auth: memberAuthRouter,
    }
)

export default appRouter