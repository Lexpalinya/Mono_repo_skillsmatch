import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Fontisto,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";

const MenuList = [
  {
    title: "ຮັບສະໝັກ",
    icon: MaterialCommunityIcons,
    route: "/(app)/home/posts",
  },
  { title: "ແຮງງານ", icon: FontAwesome6, route: "/(app)/home/jobbers" },
  { title: "ລາຍການທີສົນໃຈ", icon: Fontisto, route: "/(app)/home/favorite" },
] as const;

const HomeBody = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {MenuList.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.menuContainer}
            onPress={() => {
              if (item.route) {
                router.push(item.route);
              }
            }}
          >
            <IconComponent name="star" size={24} />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HomeBody;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    height: 500,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuContainer: {
    width: "30%",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,

    paddingVertical: 10,
  },
  menuText: {
    marginTop: 8,
    textAlign: "center",
  },
});
