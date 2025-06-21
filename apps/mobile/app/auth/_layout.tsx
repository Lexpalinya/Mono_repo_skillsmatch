import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
