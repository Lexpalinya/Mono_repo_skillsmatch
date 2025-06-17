import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const RegisterTittle = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={{ width: 150, height: 150, marginBottom: 10 }}
        contentFit="cover"
        transition={300}
      />
      <Text style={styles.title}>ລົງທະບຽນ</Text>
      <Text style={styles.subtitle}>
        ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອການສະໝັກບັນຊີຂອງທ່ານ
      </Text>
    </View>
  );
};

export default RegisterTittle;

const styles = StyleSheet.create({
  container: {
    marginTop: "15%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: { marginBottom: 30 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#557FFA",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
  },
});
