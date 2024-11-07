import { View, Pressable } from "react-native";
import React, { ElementType } from "react";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigationProp } from "../../../types/navigation";
import useGetMode from "../../../hooks/GetMode";

export default function IconButtons({
  Icon,
  onPress,
  size = 25,
  color,
}: {
  Icon: ElementType;
  onPress: () => void;
  size?: number;
  color?: string;
}) {
  const navigate = useNavigation<HomeNavigationProp>();
  const dark = useGetMode();
  const isDark = dark;
  const resolvedColor = color || (isDark ? "white" : "black");

  return (
    <View
      style={{
        width: 80,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius:9999,
        overflow:"hidden",
      }}
    >
      <Pressable
        android_ripple={{
          color: "#5B545427",
          borderless: true,
          foreground: true,
        }}
        style={{
          width: 80,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          onPress();
    
        }}
      >
        <Icon size={size} color={resolvedColor} />
      </Pressable>
    </View>
  );
}
