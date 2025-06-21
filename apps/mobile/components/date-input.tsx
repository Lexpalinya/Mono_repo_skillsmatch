import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import DatePicker from "react-native-date-picker";

import { Controller, Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  detail?: string;
  require?: boolean;
  rules?: any;
  placeholder?: string;
  className?: string;
  mode?: "date" | "time" | "datetime";
  minDate?: Date;
  maxDate?: Date;
};

export function BaseDateInput<T extends FieldValues>({
  name,
  control,
  label,
  detail,
  require = false,
  rules,
  placeholder = "ເລືອກວັນທີ",
  className,
  mode = "date",
  minDate,
  maxDate,
}: Readonly<Props<T>>) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const displayValue = value
          ? new Date(value).toLocaleDateString()
          : placeholder;

        return (
          <View style={{ marginBottom: 16 }}>
            {label && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{ fontWeight: "600", fontSize: 14, color: "#374151" }}
                >
                  {label}
                </Text>
                {require && (
                  <Text style={{ color: "red", marginLeft: 4 }}>*</Text>
                )}
              </View>
            )}

            <Pressable
              onPress={() => setOpen(true)}
              style={{
                height: 44,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: error ? "red" : "#ccc",
                borderRadius: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ color: value ? "#000" : "#9ca3af" }}>
                {displayValue}
              </Text>
            </Pressable>

            <Modal visible={open} transparent animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                >
                  <DatePicker
                    date={value ? new Date(value) : new Date()}
                    mode={mode}
                    onDateChange={(date) => onChange(date.toISOString())}
                    locale="lo-LA"
                    minimumDate={minDate}
                    maximumDate={maxDate}
                  />
                  <Pressable
                    onPress={() => setOpen(false)}
                    style={{
                      marginTop: 12,
                      backgroundColor: "#557FFA",
                      borderRadius: 8,
                      paddingVertical: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      ຕົກລົງ
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {error?.message && (
              <Text style={{ color: "red", marginTop: 4 }}>
                {error.message}
              </Text>
            )}

            {!error?.message && detail && (
              <Text style={{ color: "#6b7280", marginTop: 4, fontSize: 12 }}>
                {detail}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
