import type { Context } from 'hono';

export const createContext = (c: Context) => {
  console.log('c :>> ', c);
  return {
    req: c.req,
    res: c,
  };
};

export type TrpcContext = ReturnType<typeof createContext>;