import {
  View,
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
import {
  MessageUnfocused,
  MessagesIcon,
} from "../../../icons";

export default function CommentButton({
  clicked,
  setClicked,
}: {
  setClicked: (isClicked: boolean) => void;
  clicked: boolean;
}) {
  const dark = useGetMode();
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const liked = useSharedValue(0);

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
              <Animated.View
                style={[StyleSheet.absoluteFillObject, outlineStyle]}
              >
                <MessageUnfocused size={18} color={color} />
              </Animated.View>

              <Animated.View style={fillStyle}>
                <MessagesIcon size={18} color={color} />
              </Animated.View>
            </>
          }
        </View>

      </Pressable>
    </View>
  );
}
