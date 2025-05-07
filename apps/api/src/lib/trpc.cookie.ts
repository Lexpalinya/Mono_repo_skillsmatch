import { Context as ElysiaContext } from "elysia";
import { inferAsyncReturnType } from "@trpc/server";

export function createContext({ set }: ElysiaContext) {
  return {
    set, // Provide the set object here so you can access it in the router
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;