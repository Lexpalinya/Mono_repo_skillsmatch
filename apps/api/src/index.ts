import { Hono } from "hono";
import { cors } from "hono/cors";
import appRouter from "./router";
import { checkConnectionDATABASE } from "./lib/prisma-client";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@lib/trpc.cookie";
import memberRoute from "./modules/member/honoRouter";
const app = new Hono();

// app.use(logger());
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
app.route("/api", memberRoute);

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
