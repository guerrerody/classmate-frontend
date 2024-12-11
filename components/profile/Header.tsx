import { useState } from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image, ImageBackground } from "expo-image";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "../../redux/hooks/hooks";
import { ProfileIcon } from "../icons";
import useGetMode from "../../hooks/GetMode";
import { UploadPhotoModal } from "./UploadPhotoModal";

export default function Header({ offset }: { offset: SharedValue<number> }) {
  const user = useAppSelector((state) => state.user);
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 300;

  const headerHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(
        offset.value,
        [0, HEADER_HEIGHT + insets.top],
        [HEADER_HEIGHT / 3 + insets.top, insets.top + 58],
        Extrapolation.CLAMP
      ),
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(offset.value, [0, 80 + insets.top], [80, 0]),
      aspectRatio: 1,
      opacity: interpolate(offset.value, [0, 1 + insets.top], [1, 0]),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offset.value, [0, 1 + insets.top + 58], [0, 1]),
    };
  });

  const dark = useGetMode();
  const color = dark ? "white" : "black";
  const backgroundColor = !dark ? "white" : "black";
  const [isOpen, setIsOpen] = useState(false);

  const handleSetOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <UploadPhotoModal isOpen={isOpen} closeModal={handleSetOpen} />
      <Animated.View style={[{ width: "100%" }, headerHeight]}>
        <View style={{ height: "100%", width: "100%", backgroundColor: "black" }}>
          {user.data?.imageUri && (
            <ImageBackground
              style={{ flex: 1, opacity: 0.3 }}
              blurRadius={10}
              source={{ uri: user.data?.imageUri }}
            />
          )}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 50,
              paddingVertical: 20,
            }}
          >
            <Animated.Text
              style={[
                { color: "white", fontFamily: "jakaraBold", fontSize: 16 }, 
                textStyle
              ]}
            >
              {user.data?.name}
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          {
            width: 80,
            height: 80,
            borderRadius: 999,
            top: 60 + insets.top,
            padding: 5,
            overflow: "hidden",
            marginLeft: 15,
            zIndex: 99,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
            position: "absolute",
          },
          imageStyle,
        ]}
      >
        <Pressable
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleSetOpen}
        >
          {user.data?.imageUri ? (
            <Image
              contentFit="cover"
              style={{ height: "100%", width: "100%", borderRadius: 999 }}
              source={{ uri: user.data.imageUri }}
            />
          ) : (
            <ProfileIcon color={color} size={"115%"} />
          )}
        </Pressable>
      </Animated.View>
    </>
  );
}
