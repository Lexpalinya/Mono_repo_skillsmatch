import BaseButton from "@/components/button";
import { BaseTextInput } from "@/components/input";
import trpcClient from "@/libs/trpc-client";
import { useAuthStore } from "@/store/authStore";
import { IMemberLoginDtoType } from "@/validations/src";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { control, formState, handleSubmit, setError } =
    useForm<IMemberLoginDtoType>({
      defaultValues: { phoneNumber: "02028490166", password: "123456" },
    });
  const login = async (dataInput: IMemberLoginDtoType) => {
    try {
      const res = await fetch("http://192.168.100.25:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataInput),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Login failed");
      }
      setUser(data.data);
      router.replace("/(app)/home");
    } catch (error: any) {
      const message = error.message ?? "";

      const errorMap: Record<string, () => void> = {
        "member record not found": () =>
          setError("phoneNumber", {
            type: "server",
            message: "ບໍ່ພົບເບີນີ້ໃນລະບົບ",
          }),

        "Invalid password": () =>
          setError("password", {
            type: "server",
            message: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
          }),

        "Your account has been blocked": () =>
          alert("ບັນຊີຂອງທ່ານຖືກລະງັບການໃຊ້ງານ"),
      };

      for (const key in errorMap) {
        if (message.includes(key)) {
          errorMap[key]();
          break;
        }
      }
    }
  };

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
          <View
            // className="flex-1 items-center justify-center h-full "
            style={{
              paddingVertical: "30%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={{ width: 150, height: 150, marginBottom: 50 }}
              contentFit="cover"
              transition={300}
            />
            <View className="w-full items-center " style={{ width: "85%" }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#557FFA",
                  marginBottom: 20,
                }}
              >
                ເຂົ້າສູ່ລະບົບ
              </Text>
              <Text className="font-medium ">
                ກະລຸນາເຂົ້າສູ່ບັນຊີຂອງທ່ານເພື່ອນຳໃຊ້ແອັບ
              </Text>
              <BaseTextInput
                control={control}
                name="phoneNumber"
                label="ເບີໂທ"
              />
              <BaseTextInput
                control={control}
                name="password"
                label="ລະຫັດຜ່ານ"
                secureTextEntry={true}
              />
              <BaseButton
                className=""
                title="ເຂົ້າສຸ່ລະບົບ"
                onPress={handleSubmit(login)}
                isLoading={formState.isSubmitting}
              />
              <View style={styles.container}>
                <Text style={styles.text}>ທ່ານຍັງບໍ່ມີ ບັນຊີແມ່ນບໍ?</Text>
                <TouchableOpacity
                  onPress={() => router.push("/jobber-register")}
                >
                  <Text style={styles.buttomText}>ລົງທະບຽນ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: "row",
    gap: 5,
  },
  text: {
    fontWeight: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  buttom: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
    elevation: 0,
  },
  buttomText: {
    fontSize: 14,
    fontWeight: 800,
    textDecorationLine: "underline",
  },
});
