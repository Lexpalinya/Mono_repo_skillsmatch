import HomeAppBar from "@/components/components/HomeAppBar";
import HomeBody from "@/components/components/HomeBody";
import HomeImageSlider from "@/components/components/HomeImageSlider";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const images = [
  "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg",
  "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
  "https://gratisography.com/wp-content/uploads/2024/10/gratisography-happy-cone-800x525.jpg",
  "https://gratisography.com/wp-content/uploads/2024/10/gratisography-halloween-cat-800x525.jpg",
];
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.stlyesView}>
        <HomeAppBar />
        <ScrollView style={styles.scroll}>
          <HomeImageSlider images={images} />
          <HomeBody />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stlyesView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
