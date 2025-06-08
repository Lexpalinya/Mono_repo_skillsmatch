import type { Context } from "hono";

export const createContext = (c: Context) => {
  return {
    req: c.req,
    res: c,
  };
};

export type TrpcContext = ReturnType<typeof createContext>;
