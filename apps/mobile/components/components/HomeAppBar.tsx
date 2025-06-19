import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { profileUrl } from "@/assets/image.url";
import CustomImage from "../customImage";

const HomeAppBar = () => {
  const { user } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SkillMatch</Text>

      <CustomImage
        style={styles.image}
        source={{
          uri: user?.profile ?? profileUrl,
        }}
        width={150}
        height={150}
        borderRadius={0}
        resizeMode="cover"
        showFull={false}
      />
    </View>
  );
};

export default HomeAppBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,

    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    display: "flex",
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
    // backgroundColor: "red",
  },
});
