import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // เพิ่มเข้ามา
import CustomImage from "../customImage";

interface HomeImageSliderProps {
  images: Array<string>;
}

const HomeImageSlider: React.FC<HomeImageSliderProps> = ({ images }) => {
  const [active, setActive] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for auto-scrolling
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference for interval
  const height = 150;

  const handleScroll = ({ nativeEvent }: any) => {
    const scrollX = nativeEvent.contentOffset.x;

    // Calculate active index
    const index = Math.round(scrollX / Dimensions.get("window").width - 30);
    if (index >= 0 && index < images.length) {
      setActive(index);
    }

    // Stop and restart autoplay to reset the timer
    stopAutoPlay();
    startAutoPlay();
  };

  const startAutoPlay = () => {
    stopAutoPlay(); // Clear any existing interval before starting a new one
    // intervalRef.current = setInterval(() => {
    //   setActive((prev) => {
    //     const nextIndex = (prev + 1) % images.length; // Loop back to the start
    //     scrollViewRef.current?.scrollTo({
    //       x: nextIndex * (Dimensions.get("window").width - 30 + 30),
    //       animated: true,
    //     });
    //     return nextIndex;
    //   });
    // }, 5000); // 3-second interval
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      startAutoPlay(); // Start autoplay when the screen is focused

      return () => {
        stopAutoPlay(); // Stop autoplay when the screen is unfocused
      };
    }, []) // This effect will run on screen focus and cleanup on blur
  );

  useEffect(() => {
    startAutoPlay();

    return () => stopAutoPlay(); // Cleanup autoplay on unmount
  }, [Dimensions.get("window").width - 30]); // Restart autoplay on width change

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View style={styles.imageContainer} key={index}>
            <CustomImage
              source={{ uri: image }}
              style={[
                styles.image,
                { width: Dimensions.get("window").width - 30, height },
                index == 0 ? styles.imageFirst : null,
              ]}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              active === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeImageSlider;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30, // Add space between images
  },
  image: {
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageFirst: {
    marginLeft: 15,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d3d3d3",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#557FFA",
  },
});
