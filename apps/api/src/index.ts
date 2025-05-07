
import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger"
import { checkConnectionDATABASE } from "./lib/prisma-client";
import { cors } from "@elysiajs/cors";
import { TRPCError } from "@trpc/server";
import { trpc } from "@elysiajs/trpc";
import appRouter from "./router";



const app = new Elysia({
  prefix: "/api/v1",
}).use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }))
  .use(logger({ level: "debug" }))
  .use(trpc(appRouter, {

  }))
  .onError(({ error, code, set }) => {
    if (error instanceof TRPCError) {
      throw error;
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        message: 'Route not found',
      };
    }

    console.error('🔥 Global Error (Elysia):', error);
    set.status = 500;
    return {
      success: false,
      message: error.message || 'Internal Server Error',
    };
  })
app.get("/", () => "Hello Elysia")
  .onStart(async () => {
    await checkConnectionDATABASE();
    console.log("🚀 Server Status: RUNNING");
    console.log(`🌍 Base URL: http://localhost:3000`);
    console.log(`🔗 API Prefix: ${app.config.prefix}`);

  })
  .listen(3000);
