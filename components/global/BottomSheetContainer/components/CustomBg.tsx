import React, { useMemo } from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import useGetMode from "../../../../hooks/GetMode";

export const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const dark = useGetMode();

  const isDarkTheme = dark;
  const tint = isDarkTheme ? "dark": "light"
  const backgroundColor = isDarkTheme ? "white": "black"
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#D7EBA800", isDarkTheme ? "#06060600" : "#D7EBA800"]
    ),
  }));

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[containerStyle, { borderRadius: 20, overflow: "hidden",alignItems:"center" }]}
      >
        <BlurView
          experimentalBlurMethod= {undefined}
          intensity={100}
          tint={tint}
          style={{ position: "absolute", height: "100%", width: "100%" }}
        />
        <View style={{height:5,backgroundColor,width:50,borderRadius:9999,marginTop:10}}/>
      </Animated.View>
    </>
  );
};

export default CustomBackground;
