import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  BottomProp,
  BottomRootStackParamList,
  DiscoverProp,
} from "../../types/navigation";
import { BlurView } from "expo-blur";

import IconButtons from "../../components/global/Buttons/BottomBarButtons";
import ProfileButton from "../../components/home/header/ProfileButton";
import {
  GraduationIcon,
  SearchIcon2,
  TrophyIcon,
  FavoriteIcon,
} from "../../components/icons";
import useGetMode from "../../hooks/GetMode";
import Discover from "../../screen/App/Discover";
import Messages from "../../screen/App/Messages";
import DrawerNavigator from "./DrawerNavigation";
import Notifications from "../../screen/App/Notifications";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

import SearchBar from "../../components/discover/SearchBar";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator<BottomRootStackParamList>();

export function BottomTabNavigator() {
  const dark = useGetMode();
  // PRIMERA ENTREGA. No es necesario. No trabajeremos con chats ni socket
  //const isNewMessage = useAppSelector((state) => state?.chatlist?.new);
  const isDark = dark;
  const tint = !isDark ? "light" : "dark";
  const color = isDark ? "white" : "black";
  const backgroundColor = isDark ? "black" : "white";
  const insets = useSafeAreaInsets();
  const borderColor = isDark ? "#FFFFFF7D" : "#4545452D";

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <>
          {(
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <BottomTabBar {...props} />
            </View>
          )}
        </>
      )}
      sceneContainerStyle={{ backgroundColor }}
      screenOptions={({ navigation, route }) => {
        return {
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          headerStatusBarHeight: 30,
          animation: "shift",
          tabBarStyle: {
            backgroundColor: backgroundColor,
            elevation: 0,
            height: Platform.OS == "ios" ? 40 + insets.bottom : 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            borderTopWidth: 0.5,
            borderColor,
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 0.2,
            borderColor,
          },
          tabBarIcon: ({ focused }) => {
            const icon = () => {
              if (route.name === "BottomHome") {
                return GraduationIcon;
              } else if (route.name === "Discover") {
                return SearchIcon2;
              } else if (route.name === "Messages") {
                return TrophyIcon;
              } else {
                return FavoriteIcon;
              }
            };
            const fillColor = focused ? "blue" : "white";
            return (
              <IconButtons
                Icon={icon()}
                onPress={() => navigation.navigate(route.name)}
                size={26}
                color={fillColor}
              />
            );
          },
          headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
          headerShadowVisible: false,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "transparent" },
        };
      }}
    >
      <Tab.Screen
        name="BottomHome"
        options={({ navigation, route }: BottomProp) => {
          return {
            headerShown: false,

            title: "Home",

            headerTitleStyle: { fontFamily: "instaBold", fontSize: 24 },
            headerTitleAlign: "center",
          };
        }}
        component={DrawerNavigator}
      />

      <Tab.Screen
        name="Discover"
        component={Discover}
        options={({ navigation, route }: DiscoverProp) => {
          return {
            title: "Discover",
            headerTitle: () => {
              return <SearchBar />;
            },
            headerShown: true,
            headerTransparent: true,
            headerStyle: {
              height: Platform.OS == "ios" ? 140 : undefined,
            },
            headerBackgroundContainerStyle: {
              borderBottomWidth: 0,
              borderColor,
            },
            headerBackground: () => (
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                style={{
                  opacity: 0,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  top: 0,
                  right: 0,
                }}
                tint={tint}
                intensity={100}
              />
            ),
            headerLeft: () => (
              <ProfileButton
                color={color}
                style={{ paddingLeft: 20 }}
                size={40}
                onPress={() => {
                  navigation.navigate("BottomHome");
                }}
              />
            ),
          };
        }}
      />

      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          headerBackground: () => (
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              style={{
                opacity: 0,
                position: "absolute",
                bottom: 0,
                left: 0,
                top: 0,
                right: 0,
              }}
              tint={tint}
              intensity={100}
            />
          ),
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontFamily: "uberBold",
            paddingTop: 10,
            fontSize: 30,
            color,
          },
          title: "Ratings",
          headerTransparent: true,
          headerBackgroundContainerStyle: undefined,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={({ navigation }) => {
          return {
            title: "Notifications",
            headerTitle: () => {
              return (
                <View
                  style={{
                    marginTop: Platform.select({ ios: 30, android: 20 }),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "uberBold",
                      fontSize: 30,

                      color,
                    }}
                  >
                    Favorites
                  </Text>
                  <Text
                    style={{ fontFamily: "jakara", includeFontPadding: false }}
                  >
                    Favorites Posts
                  </Text>
                </View>
              );
            },
            headerTitleAlign: "left",

            headerBackground: () => (
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                style={{
                  opacity: 0,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  top: 0,
                  right: 0,
                }}
                tint={tint}
                intensity={100}
              />
            ),
            headerBackgroundContainerStyle: {
              borderBottomWidth: 0,
            },
          };
        }}
      />


    </Tab.Navigator>
  );
}
