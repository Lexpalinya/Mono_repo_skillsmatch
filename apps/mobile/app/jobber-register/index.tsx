import { KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import JobberRegisterForm from "./form";

export default function index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <JobberRegisterForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
