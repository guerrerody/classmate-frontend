import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerRootStackParamList } from "../../types/navigation";
import useGetMode from "../../hooks/GetMode";
import CustomDrawerContent from "../../components/home/drawer/CustomDrawer";
import { Dimensions, Platform } from "react-native";
import Home from "../../screen/App/Home";
import ProfileButton from "../../components/home/header/ProfileButton";

const Drawer = createDrawerNavigator<DrawerRootStackParamList>();
const { width } = Dimensions.get("window");

export default function DrawerNavigator() {
  const dark = useGetMode();
  const isDark = dark;
  const color = isDark ? "white" : "black";
  const borderColor = isDark ? "#FFFFFF7D" : "#4545452D";
  const backgroundColor = isDark ? "black" : "white";

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStatusBarHeight: 30,
        drawerStyle: {
          backgroundColor: backgroundColor,
          width: width * 0.85,
        },
        sceneContainerStyle: { backgroundColor },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => {
          return {
            drawerItemStyle: { display: "none" },
            headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
            headerShadowVisible: false,
            headerBackgroundContainerStyle: {
              borderBottomWidth: 0.2,
              borderColor,
              backgroundColor: backgroundColor,
            },
            headerTransparent: false,
            headerTitleAlign: "center",
            headerRight: () => (
              <ProfileButton
                color={color}
                style={{ paddingRight: 20 }}
                size={40}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            ),
            headerStyle: {
              height: Platform.OS == "ios" ? 100 : undefined,
              backgroundColor: backgroundColor,
            },
            title: "Classmate",
          };
        }}
      />
    </Drawer.Navigator>
  );
}
