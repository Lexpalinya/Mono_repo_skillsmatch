import React, { useState } from "react";
import {
  Image,
  ImageProps,
  Pressable,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";

import ImageViewer from "react-native-image-zoom-viewer";

interface ImagePropsCustom extends ImageProps {
  showFull?: boolean;
  source?: {
    uri: string;
  };
}

const CustomImage: React.FC<ImagePropsCustom> = ({
  source,
  width = 100,
  height = 100,
  borderRadius = 8,
  style = {},
  resizeMode = "cover",
  alt = "",
  showFull = true,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    if (source?.uri) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => setIsModalVisible(false);

  return (
    <View>
      <Pressable onPress={openModal}>
        <Image
          source={
            source ?? {
              uri: "https://static.thenounproject.com/png/504708-200.png",
            }
          }
          style={[styles.image, { width, height, borderRadius }, style]}
          resizeMode={source ? resizeMode : "center"}
          accessibilityLabel={alt}
        />
      </Pressable>
      <Modal
        visible={isModalVisible && showFull}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 15,
              zIndex: 1,
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderRadius: 100,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
            onPress={closeModal}
          >
            <Text
              style={{
                fontSize: 35,
              }}
            >
              X
            </Text>
          </TouchableOpacity>
          {source?.uri ? (
            <ImageViewer
              imageUrls={[{ url: source.uri }]}
              style={{ flex: 1, width: "100%" }}
              backgroundColor="rgba(0, 0, 0, 0.2)"
              // enableSwipeDown

              onSwipeDown={closeModal}
              onCancel={closeModal}
              renderIndicator={() => {
                return <></>;
              }} // ซ่อนตัวบ่งชี้ภาพ
            />
          ) : (
            <View style={styles.errorContainer}>
              <Image
                source={{
                  uri: "https://static.thenounproject.com/png/504708-200.png",
                }}
                style={{ flex: 1, width: 100, height: 100 }}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#e0e0e0",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "80%",
    height: "50%",
    borderRadius: 10,
  },
});
