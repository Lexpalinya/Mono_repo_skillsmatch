import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import routeTree from "@/routes/routeTree";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Confirmer, ThemeProvider, Toaster } from "@skillsmatch/ui";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <Confirmer />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
