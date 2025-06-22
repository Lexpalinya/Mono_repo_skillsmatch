import { router, t } from "@lib/trpc";
import {
    idDto,
    JobberSkillCreateDto,
    JobberSkillDeleteDto,
} from "@skillsmatch/dto";
import {
    createOrReplaceJobberSkills,
    deleteJobberSkill,
    getJobberSkills,
} from "./service";

export const jobberSkillRoute = router({
    create: t.procedure
        .input(JobberSkillCreateDto)
        .mutation(async ({ input }) => {
            return await createOrReplaceJobberSkills(input);
        }),
    delete: t.procedure
        .input(JobberSkillDeleteDto)
        .mutation(async ({ input }) => {
            return await deleteJobberSkill(input);
        }),
    getJobberSkills: t.procedure.input(idDto).query(async ({ input }) => {
        return await getJobberSkills(input.id);
    }),
});
