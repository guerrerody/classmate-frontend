import { View, Pressable } from "react-native";
import useGetMode from "../../../../hooks/GetMode";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigationProp } from "../../../../types/navigation";

export default function Fab({ item }: { item: JSX.Element }) {
  const dark = useGetMode();
  const isDark = dark;
  const navigation = useNavigation<HomeNavigationProp>();
  const backgroundColor = !isDark ? "#512DA8" : "#D1C4E9";

  return (
    <View
      style={{
        position: "absolute",
        bottom: 120,
        borderRadius: 999,
        right: 25,
        borderColor: dark ? "#FFFFFF1E" : "#00000012",
        borderWidth: 0.5,
        alignItems: "center",
        backgroundColor: backgroundColor,
        justifyContent: "center",
        width: 65,
        height: 65,
        overflow: "hidden",
        zIndex: 999,
      }}
    >
      <Pressable
        android_ripple={{ color: "white", foreground: true }}
        onPress={() => {
          navigation.navigate("PostContent");
        }}
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ zIndex: 200 }}>{item}</View>
      </Pressable>
    </View>
  );
}
