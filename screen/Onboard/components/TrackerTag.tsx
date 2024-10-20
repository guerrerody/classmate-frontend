import { View, Text, useColorScheme } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import useGetMode from "../../../hooks/GetMode";

export default function TrackerTag({ color }: { color?: string }) {
  const dark = useGetMode();
  const isDark = dark;
  const backgroundColor = isDark ? "#D1C4E9" : "#512DA8";

  return (
    <Animated.View
      entering={FadeInLeft.springify()}
      exiting={FadeOutLeft.springify()}
      style={{
        width: 20,
        height: 10,
        borderRadius: 999,
        backgroundColor: color || backgroundColor,
      }}
    />
  );
}
