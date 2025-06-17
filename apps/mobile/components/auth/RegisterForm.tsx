import { IMemberCreateDtoType } from "@/validations/src";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseButton from "../button";
import { BaseTextInput } from "../input";
import trpcClient from "@/libs/trpc-client";
const laErrorMessageMap: Record<string, string> = {
  "Username is required": "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້",
  "Invalid email": "ອີເມວບໍ່ຖືກຕ້ອງ",
  Required: "ກະລຸນາປ້ອນຂໍ້ມູນ",
  "Password must be at least 6 characters": "ລະຫັດຜ່ານຕ້ອງຢ່າງນ້ອຍ 6 ຕົວອັກສອນ",
  "Phone number is required": "ກະລຸນາປ້ອນເບີໂທ",
  "Invalid URL": "URL ບໍ່ຖືກຕ້ອງ",
  "Expected string, received undefined": "ກະລຸນາປ້ອນຂໍ້ມູນ (string)",
};
const translateError = (message: string): string => {
  return laErrorMessageMap[message] ?? message;
};
export default function RegisterForm() {
  const [role, setRole] = useState<"jobber" | "company">("jobber");

  const { setValue, control, formState, handleSubmit, setError } =
    useForm<IMemberCreateDtoType>({
      defaultValues: {
        username: "",
        role: "jobber",
      },
    });

  const register = async (dataInput: IMemberCreateDtoType) => {
    try {
      await trpcClient.auth.register.mutate(dataInput);
    } catch (error: any) {
      console.log("error :>> ", error);
      const message = error?.data?.stack as string;

      if (message?.includes("member record already exists where email =")) {
        setError("email", {
          type: "server",
          message: "ອີເມວນີ້ໄດ້ຖືກນໍາໃຊ້ແລ້ວ",
        });
      }
      if (
        message?.includes("member record already exists where phoneNumber =")
      ) {
        setError("phoneNumber", {
          type: "server",
          message: "ເບີໂທນີ້ໄດ້ຖືກນໍາໃຊ້ແລ້ວ",
        });
      }
      if (message?.includes("member record already exists where username =")) {
        setError("username", {
          type: "server",
          message: "ຊື່ນີ້ໄດ້ຖືກນຳໃໍຊ້ແລ້ວ",
        });
      }
      if (error.data?.zodError?.fieldErrors) {
        const fieldErrors = error.data.zodError.fieldErrors;
        for (const key in fieldErrors) {
          const messages = fieldErrors[key];
          if (messages && messages.length > 0) {
            const translatedMessage = translateError(messages[0]);
            setError(key as keyof IMemberCreateDtoType, {
              type: "server",
              message: translatedMessage,
            });
          }
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
