import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, View, StyleSheet, AppState } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import { RootStackParamList } from "../types/navigation";
import ImageFullScreen from "../screen/App/ImageFullScreen";
import Profile from "../screen/App/Profile";
import useGetMode from "../hooks/GetMode";
import { BottomSheetContainer } from "../components/global/BottomSheetContainer";
import PostContent from "../screen/App/PostContent";
import VideoFullScreen from "../screen/App/VideoFullScreen";
import { useGetUserQuery } from "../redux/api/user";
import PostScreen from "../screen/App/PostScreen";
import ProfilePeople from "../screen/App/ProfilePeople";
import ChatScreen from "../screen/App/ChatScreen";
import SearchUsers from "../screen/App/SearchUsers";
import { BottomTabNavigator } from "./Main/BottomNavigation";
import FollowingFollowers from "../screen/App/FollowingFollowers";
import EditProfile from "../screen/App/EditProfile";
import ChangeData from "../screen/App/ChangeData";

const BACKGROUND_FETCH_TASK = "background-fetch";
const Stack = createNativeStackNavigator<RootStackParamList>();

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export default function Main() {
  const dark = useGetMode();
  const isDark = dark;
  const backgroundColor = isDark ? "black" : "white";
  const color = !isDark ? "black" : "white";
  const borderColor = isDark ? "#FFFFFF7D" : "#4545452D";

  useGetUserQuery(null);

  const appState = useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  console.log(">>>> file: Main.tsx ~ Main ~ appStateVisible:", appStateVisible);
  
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    handlePresentModalPress();
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetContainer />
      <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor } }}>
        <Stack.Screen
          name="Main"
          options={{ headerShown: false, title: "Home" }}
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name="Profile"
          options={{
            headerTitle: "",
            animation: Platform.OS === "ios" ? "fade_from_bottom" : "none",
            headerTransparent: true,
            headerTintColor: "white",
          }}
          component={Profile}
        />
        <Stack.Screen
          name="ProfilePeople"
          options={{
            headerTitle: "",
            animation: "fade_from_bottom",
            headerTransparent: true,
            headerTintColor: "white",
          }}
          component={ProfilePeople}
        />
        <Stack.Screen
          name="ImageFullScreen"
          options={{
            title: "",
            animation: "fade_from_bottom",
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: "white",
          }}
          component={ImageFullScreen}
        />
        <Stack.Screen
          name="PostContent"
          options={{
            title: "",
            headerShown: false,
            animation: "fade_from_bottom",
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: "white",
          }}
          component={PostContent}
        />
        <Stack.Screen
          name="ChatScreen"
          options={{
            headerBackground: () => (
              <>
                {(
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      top: 0,
                      right: 0,
                      borderColor,
                      borderBottomWidth: 0.5,
                      backgroundColor: "red",
                    }}
                  />
                )}
              </>
            ),
            title: "Chat",
            animation: "fade_from_bottom",
            headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: color,
            headerStyle: {
              backgroundColor,
            },
          }}
          component={ChatScreen}
        />
        <Stack.Screen
          name="VideoFullScreen"
          options={{
            title: "",
            contentStyle: { backgroundColor: "black" },
            animation: "fade_from_bottom",
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: "white",
          }}
          component={VideoFullScreen}
        />
        <Stack.Screen
          name="ViewPost"
          options={{
            title: "Post",
            animation:"fade_from_bottom",
            headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: color,
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
          component={PostScreen}
        />
        <Stack.Screen
          name="FollowingFollowers"
          options={{
            title: "Follow List",
            animation: "fade_from_bottom",
            headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: color,
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
          component={FollowingFollowers}
        />
        <Stack.Screen
          name="EditProfile"
          options={{
            title: "Edit Profile",
            animation: "none",
            headerTitleStyle: { fontFamily: "uberBold", fontSize: 20, color },
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: color,
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
          component={EditProfile}
        />
        <Stack.Screen
          name="SearchUser"
          component={SearchUsers}
          options={{
            headerTintColor: color,
            animation: "fade_from_bottom",
            headerStyle: { backgroundColor },
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="ChangeData"
          component={ChangeData}
          options={{
            headerTintColor: color,
            animation: "none",
            headerStyle: { backgroundColor },
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
