import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import useGetMode from "../../../../hooks/GetMode";
import { MessageUnfocused } from "../../../icons";

export default function MessageButton({
  isLiked,
  clicked,
  text,
  setClicked,
}: {
  text?: string;
  setClicked: (isClicked: boolean) => void;
  clicked: boolean;
  isLiked?: boolean;
}) {
  const dark = useGetMode();
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const liked = useSharedValue(isLiked ? 1 : 0);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });
  
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          width: 30,
          height: 22,
          gap: 2,
          alignItems: "center",
        }}
        onPress={() => {
          liked.value = withSpring(liked.value ? 0 : 1);
          setClicked(!clicked);
        }}
      >
        <View style={{ width: 18 }}>
          {
            <>
              <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
                <MessageUnfocused size={18} color={color} />
              </Animated.View>
              <Animated.View style={fillStyle}>
                <MessageUnfocused size={18} color={color} />
              </Animated.View>
            </>
          }
        </View>
        <Text style={{ color, fontFamily: "jakara", includeFontPadding: false }}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
