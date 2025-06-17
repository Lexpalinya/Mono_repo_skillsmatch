// app/index.tsx
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import "../global.css";
export default function IndexPage() {
  const { user } = useAuthStore();

  if (user === undefined) return null;

  return <Redirect href={user ? "/(app)/search" : "/auth/login"} />;
}
