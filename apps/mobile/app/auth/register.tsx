import RegisterBottom from "@/components/auth/RegisterBottom";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterTittle from "@/components/auth/RegisterTittle";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function register() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.stlyesView}>
            <RegisterTittle />
            <RegisterForm />
            <RegisterBottom />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stlyesView: {
    paddingVertical: "10%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
