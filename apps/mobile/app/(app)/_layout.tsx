import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

export default function TabLayout() {
  const { user } = useAuthStore();
  const TabArr = [
    {
      route: "home",
      label: "ໜ້າຫຼັກ",
      icon: "home-outline",
      iconFocused: "home",
    },
    {
      route: "suggest",
      label: "ແນະນຳ",
      icon: "sparkles-outline",
      iconFocused: "sparkles",
    },
    {
      route: "interview",
      label: user?.role === "company" ? "ສະໝັກໄວ້" : "ສຳພາດ",
      icon: "chatbox-outline",
      iconFocused: "chatbox",
    },
    {
      route: "profile",
      label: user?.role === "company" ? "ໂປຣໄຟຣ" : "ບໍລິສັດ",
      icon: "person-outline",
      iconFocused: "person",
    },
  ];

  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarStyle: styles.tabBarStyle }}
    >
      {TabArr.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.route}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View
                style={[styles.container, focused && styles.containerFocus]}
              >
                <Ionicons
                  name={(focused ? item.iconFocused : item.icon) as any}
                  size={22}
                  color={focused ? "#557FFA" : "#999"}
                />
                <Text
                  className="w-full"
                  style={[styles.label, focused && styles.labelFocus]}
                >
                  {item.label}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 75,
    paddingBottom: 20,
  },
  container: {
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    minHeight: 60,
  },
  containerFocus: {
    top: -5,
  },
  label: {
    paddingTop: 2,

    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  labelFocus: {
    color: "#557FFA",
    fontWeight: "bold",
  },
});
