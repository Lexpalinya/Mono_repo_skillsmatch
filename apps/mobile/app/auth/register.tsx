import RegisterBottom from "@/components/auth/RegisterBottom";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterTittle from "@/components/auth/RegisterTittle";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function register() {
  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={styles.stlyesView}>
        <RegisterTittle />
        <RegisterForm />
        <RegisterBottom />
      </View>
    </ScrollView>
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
