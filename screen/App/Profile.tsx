import { View } from "react-native";
import React, { useEffect } from "react";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import AnimatedScreen from "../../components/global/AnimatedScreen";
import Header from "../../components/profile/Header";
import MyPosts from "./ProfileScreens/MyPosts";
import { useGetFollowDetailsQuery } from "../../redux/api/user";

export default function Profile() {
  const getFollowData = useGetFollowDetailsQuery(null);
  const offset = useSharedValue(0);
  console.log(">>>> file: Profile.tsx: ~ Profile ~ offset:", offset);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log(">>>> file: Profile.tsx ~ scrollHandler ~ event:", event)
    offset.value = event.contentOffset.y;
  });

  useEffect(() => {
    console.log(getFollowData.data);
    getFollowData.refetch();
  }, []);

  return (
    <AnimatedScreen>
      <ExpoStatusBar style="light" backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <Header offset={offset} />
        <MyPosts onScroll={scrollHandler} />
      </View>
    </AnimatedScreen>
  );
}
