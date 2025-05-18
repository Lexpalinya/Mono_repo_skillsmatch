import { initTRPC } from "@trpc/server";
import { ZodError } from 'zod'
import { Context } from "./trpc.cookie";


const t = initTRPC.context<Context>().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                message: error.message,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            }
        }
    },

})

export const publicProcedure = t.procedure;
export const router = t.router
export { t };
