import { View, Text } from "react-native";
import React from "react";
import { BaseTextInput } from "@/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IJobberCreateDtoType, JobberCreateDto } from "@skillsmatch/dto";
import { BaseSelectInput } from "@/components/select";
import { BaseDateInput } from "@/components/date-input";

export default function JobberRegisterForm() {
  const { control } = useForm<IJobberCreateDtoType>({
    resolver: zodResolver(JobberCreateDto),
  });
  return (
    <View
      className="flex-1 justify-center items-center p-4 gap-4"
      style={{ marginHorizontal: 16 }}
    >
      <BaseTextInput control={control} name="firstName" label="ຊື່" />
      <BaseTextInput control={control} name="lastName" label="ນາມສະກຸນ" />

      <BaseSelectInput
        control={control}
        multiple={false}
        options={[
          { label: "ເພດຊາຍ", value: "male" },
          { label: "ເພດຍິງ", value: "female" },
          { label: "ບໍ່ລະບຸ", value: "transgender" },
        ]}
        name="gender"
        label="ເພດ"
      />
      <BaseDateInput control={control} name="birthday" />
    </View>
  );
}
