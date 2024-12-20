import { BlurView } from "expo-blur";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileButton from "./ProfileButton";
import React from "react";
import { HomeNavigationProp } from "../../../types/navigation";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import useGetMode from "../../../hooks/GetMode";

function CustomDrawerHeader(props: DrawerHeaderProps) {
  const navigation = useNavigation<HomeNavigationProp>();
  const dark = useGetMode();
  const isDark = dark;
  const TextColor = isDark ? "white" : "black";

  return (
    <SafeAreaView>
      <BlurView
        experimentalBlurMethod= {undefined}
        style={[
          style.blurView,
          { borderBlockColor: isDark ? "#0000002F" : "#FFFFFF30" },
        ]}
        tint={isDark ? "dark" : "light"}
        intensity={200}
      >
        <View style={style.titleView}>
          <View style={{ width: "33.3%", alignItems: "flex-start" }}>
            <ProfileButton
              onPress={() => props.navigation.toggleDrawer()}
              size={45}
              color={isDark ? "white" : "black"}
            />
          </View>
          <View style={{ width: "33.3%", alignItems: "center" }}>
            <Text style={[style.headerStyle, { color: TextColor }]}>
              {props.options.title}
            </Text>
          </View>
          <View style={{ width: "33.3%" }} />
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

export default React.memo(CustomDrawerHeader);

const style = StyleSheet.create({
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 90,
    paddingHorizontal: 10,
    borderBlockColor: "#0000002F",
    borderBottomWidth: 0.5,
    right: 0,
    alignItems: "center",
  },
  titleView: {
    paddingTop: 44,
    paddingBottom: 10,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerStyle: {
    fontFamily: "instaBold",
    fontSize: 20,
  },
});
