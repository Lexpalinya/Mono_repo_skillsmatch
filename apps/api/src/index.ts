// import { Elysia } from "elysia";
// import { logger } from "@bogeychan/elysia-logger";
// import { checkConnectionDATABASE } from "./lib/prisma-client";
// import { cors } from "@elysiajs/cors";
// import { TRPCError } from "@trpc/server";
// import { trpc } from "@elysiajs/trpc";
// import appRouter from "./router";

// const app = new Elysia()
//   .use(trpc(appRouter, { endpoint: "/trpc" }))
//   .use(
//     cors({
//       origin: "http://localhost:5173",
//       credentials: true,
//       methods: ["GET", "POST", "PUT", "DELETE"],
//     })
//   )

//   .use(logger({ level: "info" }))
//   .onError(({ error, code, set }) => {
//     if (error instanceof TRPCError) {
//       throw error;
//     }

//     if (code === "NOT_FOUND") {
//       set.status = 404;
//       return {
//         success: false,
//         message: "Route not found",
//       };
//     }

//     console.error("🔥 Global Error (Elysia):", error);
//     set.status = 500;
//     return {
//       success: false,
//       message: error.message || "Internal Server Error",
//     };
//   });
// app
//   .get("/", () => "Hello Elysia")
//   .onStart(async () => {
//     await checkConnectionDATABASE();
//     console.log("🚀 Server Status: RUNNING");
//     console.log(`🌍 Base URL: http://localhost:3000`);
//     console.log(`🔗 API Prefix: ${app.config.prefix}`);
//   })
//   .listen({ port: 3000 });

//-----------------------------------------------------------
import { Hono } from "hono";
import { cors } from "hono/cors";
import appRouter from "./router";
import { checkConnectionDATABASE } from "./lib/prisma-client";
import { trpcServer } from "@hono/trpc-server";
import { TRPCError } from "@trpc/server";
const app = new Hono();

// CORS middleware
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Error handler
app.onError((err, c) => {
  console.error("🔥 Global Error (Hono):", err);
  if (err.name === "TRPCError") {
    return c.json({ success: false, message: err.message }, 400);
  }
  if (c.res.status === 404) {
    return c.json({ success: false, message: "Route not found" }, 404);
  }
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);
// Root route
app.get("/", (c) => c.text("Hello Hono"));


async function start() {
  await checkConnectionDATABASE();
  console.log("🚀 Server Status: RUNNING");
  console.log("🌍 Base URL: http://localhost:3000");
}

start();

export default {
  port: 3000,
  fetch: app.fetch,
};