import { router, t } from "@lib/trpc";
import { ApplyForJobCreateDTO, ApplyForJobUpdateDTO, idDto } from "@skillsmatch/dto";
import { CreateApplyForJob, DeleteApplyForJob, UpdateApplyForJob } from "./service";



export const applyForJobRouter = router({
    create: t.procedure.input(ApplyForJobCreateDTO).mutation(({ input }) => {
        return CreateApplyForJob(input)
    }),
    update: t.procedure.input(ApplyForJobUpdateDTO).mutation(({ input }) => {
        return UpdateApplyForJob(input.id, input);
    }),
    delete: t.procedure.input(idDto).mutation(({ input }) => {
        return DeleteApplyForJob(input.id)
    })

})