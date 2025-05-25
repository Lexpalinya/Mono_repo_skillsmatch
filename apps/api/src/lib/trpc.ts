import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { TrpcContext } from './trpc.cookie';


const t = initTRPC.context<TrpcContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        message: error.message,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export { t }; // ✅ Make sure this is exported
