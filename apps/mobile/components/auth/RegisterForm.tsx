import { IMemberCreateDtoType } from "@/validations/src";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseButton from "../button";
import { BaseTextInput } from "../input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { MemberCreateDto } from "@skillsmatch/dto";
import { router } from "expo-router";

export default function RegisterForm() {
  const { setUser } = useAuthStore();

  const [role, setRole] = useState<"jobber" | "company">("jobber");

  const { setValue, control, formState, handleSubmit, setError } =
    useForm<IMemberCreateDtoType>({
      defaultValues: {
        username: "",
        role: "jobber",
      },
      resolver: zodResolver(MemberCreateDto),
    });

  const register = async (dataInput: IMemberCreateDtoType) => {
    try {
      router.replace("/(app)/home");
      const res = await fetch("http://192.168.100.25:3000/api/register", {
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
      const message = error?.message as string;
      const errorMap: Record<string, () => void> = {
        "member record already exists where email =": () => {
          setError("email", {
            type: "server",
            message: "ອີເມວນີ້ໄດ້ຖືກນໍາໃຊ້ແລ້ວ",
          });
        },
        "member record already exists where phoneNumber =": () => {
          setError("phoneNumber", {
            type: "server",
            message: "ເບີໂທນີ້ໄດ້ຖືກນໍາໃຊ້ແລ້ວ",
          });
        },
        "member record already exists where username =": () => {
          setError("username", {
            type: "server",
            message: "ຊື່ນີ້ໄດ້ຖືກນຳໃໍຊ້ແລ້ວ",
          });
        },
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
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <TouchableOpacity
          className="items-center"
          style={[
            styles.buttomTop,
            role === "jobber" && styles.buttomTopSelect,
          ]}
          onPress={() => {
            const newRole = "jobber";
            setRole(newRole);
            setValue("role", newRole);
          }}
        >
          <Text>ຜູ້ຊອກຫາວຽກ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          style={[
            styles.buttomTop,
            role === "company" && styles.buttomTopSelect,
          ]}
          onPress={() => {
            const newRole = "company";
            setRole(newRole);
            setValue("role", newRole);
          }}
        >
          <Text>ບໍລິສັດ</Text>
        </TouchableOpacity>
      </View>

      <BaseTextInput control={control} name="username" label="ຊື່" />

      <BaseTextInput control={control} name="phoneNumber" label="ເບີໂທ" />
      <BaseTextInput control={control} name="email" label="ອີເມວ" />
      <BaseTextInput control={control} name="password" label="ລະຫັດຜ່ານ" />

      <BaseButton
        title="ລົງທະບຽນ"
        onPress={handleSubmit(register)}
        isLoading={formState.isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 30,
  },
  containerTop: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
  },
  buttomTop: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    alignItems: "center",
  },
  buttomTopSelect: {
    borderBottomWidth: 2,
    borderBottomColor: "#557FFA",
  },
});
