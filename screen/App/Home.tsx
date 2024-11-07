import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import useGetMode from "../../hooks/GetMode";
import HomeAll from "./HomeScreens/HomeAll";
import HomeFollowed from "./HomeScreens/HomeFollowed";

const initialLayout = { width: Dimensions.get("window").width };

export default function Home() {
  const dark = useGetMode();
  const isDark = dark;
  const color = isDark ? "white" : "black";
  const backgroundColor = isDark ? "black" : "white";

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "homeAll", title: "For You" },
    { key: "homeFollowed", title: "Following" },
  ]);

  const renderScene = SceneMap({
    homeAll: HomeAll,
    homeFollowed: HomeFollowed,
  });

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: color }}
            style={{ backgroundColor }}
            labelStyle={{ color, fontFamily: "uberBold" }}
          />
        )}
      />
    </View>
  );
}
