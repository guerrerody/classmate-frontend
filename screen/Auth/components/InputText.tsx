import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import useGetMode from "../../../hooks/GetMode";

export default function InputText({
  props,
  style,
}: Readonly<{
  props: TextInputProps;
  style?: StyleProp<ViewStyle>;
}>) {
  const dark = useGetMode();
  const isDark = dark;
  const backgroundColor = isDark ? "#292828" : "#f1f1f1";
  const color = isDark ? "white" : "black";
  const placeholderColor = isDark ? "#959595" : "#393939";
  return (
    <View
      style={[
        {
          width: "100%",
          height: 50,
        },
        style,
      ]}
    >
      <TextInput
        cursorColor={color}
        placeholder="Enter Username"
        placeholderTextColor={placeholderColor}
        style={[
          {
            width: "100%",
            height: "100%",
            fontSize: 16,
            color,
            fontFamily: "jakara",
            includeFontPadding: false,
            borderStyle: "solid",
            borderBottomWidth: 2,
            borderBottomColor: backgroundColor,
            paddingHorizontal: 20,
          },
        ]}
        autoCapitalize={props.autoCapitalize ?? "none"}
        {...props}
      />
    </View>
  );
}
