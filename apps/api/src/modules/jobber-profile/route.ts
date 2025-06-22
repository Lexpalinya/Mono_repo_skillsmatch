import { router, t } from "@lib/trpc";
import { idDto, JobberProfileCreateDto, JobberProfileUpdateDto } from "@skillsmatch/dto";
import { CreateJobberProfile, GetJobberProfileByJobberId, UpdateJobberProfile } from "./service";



export const jobberProfileRoute = router({
    create: t.procedure.input(JobberProfileCreateDto).mutation(async ({ input }) => {
        return CreateJobberProfile(input)
    }),
    update: t.procedure.input(JobberProfileUpdateDto.extend(idDto.shape)).mutation(async ({ input }) => {
        return UpdateJobberProfile(input.id, input)
    }),
    getByJobberId: t.procedure.input(idDto).query(async ({ input }) => {
        return GetJobberProfileByJobberId(input.id)
    })


})