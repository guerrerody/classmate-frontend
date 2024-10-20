import { View, Text, Dimensions, useColorScheme } from "react-native";
import { Image, ImageSource, } from "expo-image";

import Animated, { FadeInLeft } from "react-native-reanimated";
import useGetMode from "../../../hooks/GetMode";


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
console.log("🚀 ~ file: OnboardBuilder.tsx:10 ~ width:", width)
export default function OnboardBuilder({
  header,
  subText,
  imageUri,
  quote,
}: {
  header: string;
  subText: string;
  imageUri: ImageSource;
  quote: string;
}) {
  const dark = useGetMode();
  const color = !dark ? "black" : "white";

  return (
    <View style={{ flex: 1 }}>
        <Image style={{ width, height: "100%" }} contentFit="cover" source={imageUri} />
        <Animated.View
          entering={FadeInLeft.delay(200)}
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            padding: 15,
            borderRadius: 15,
            backgroundColor: "#FFFFFFDA",
          }}
        >
          <Text style={{ fontFamily: "mulishBold", fontSize: 36, color }}>
            {header}
          </Text>
          <Text style={{ fontFamily: "mulish", fontSize: 26, color: "#929292" }}>
            {subText}
          </Text>
          <Text style={{ fontFamily: "mulish", fontSize: 12, color: "#929292" }}>
            {quote}
          </Text>
        </Animated.View>
    </View>
  );
}
