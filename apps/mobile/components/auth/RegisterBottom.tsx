import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RegisterBottom = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ມີບັນຊີຢູ່ແລ້ວ </Text>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.buttomText}>ເຂົ້າສູ່ລະບົບ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterBottom;

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
    textDecorationLine: "underline",
  },
});
