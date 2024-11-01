import {
  View,
  Dimensions,
  ScrollView,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import OnboardBuilder from "./components/OnboardBuilder";
import TrackerTag from "./components/TrackerTag";
import Button from "../../components/global/Buttons/Button";
import {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { setRoute } from "../../redux/slice/routes";
import useGetMode from "../../hooks/GetMode";

const width = Dimensions.get("window").width;


export default function Onboard() {
  const [page, setPage] = useState(0);
  const size = useSharedValue(55);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(size.value, [55, 60], [55, 60]),
      height: interpolate(size.value, [55, 60], [55, 60]), // map opacity value to range between 0 and 1
    };
  });

  useEffect(() => {
    size.value = withRepeat(withTiming(60, { duration: 500 }), -1, true);
    return () => {
      cancelAnimation(size);
    };
  }, []);


  const dark = useGetMode();
  const isDark = dark;
  const color = isDark ? "black" : "white";
  const backgroundColor = isDark ? "#D1C4E9" : "#512DA8";
  const dispatch = useAppDispatch();
  const trackerTags = [0, 1];
  
  return (
    <View
      style={{ flex: 1, justifyContent: "space-between", }}
    >
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          if (x <= width / 2) {
            setPage(0);
          } else {
            setPage(1);
          }
        }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        style={{ width }}
        decelerationRate={"fast"}
      >
        <OnboardBuilder
          header="Welcome to Classmate Post"
          subText="Post to inspire"
          imageUri={require("../../assets/images/move.png")}
          quote="If there is a possibility of several things going wrong, the one that will cause the most damage will be the one to go wrong."
        />
        <OnboardBuilder
          header={"Explore the \nnew world"}
          subText="to your desire"
          imageUri={require("../../assets/images/phone.png")}
          quote="Left to themselves, things tend to go from bad to worse."
        />
      </ScrollView>
      <View
        style={{
          height: 20,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", gap: 5 }}>
          {trackerTags.map((tagPage) => (
            <TrackerTag
              key={tagPage}
              color={page === tagPage ? undefined : (!isDark ? "#0000002A" : "#676767CC")}
            />
          ))}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 90,
          paddingVertical: 30,
        }}
        >
          <Button
            loading={false}
            onPress={() => {
              dispatch(setRoute({ route: "Auth" }));
            }}
          >
            <Text
              style={{
                fontFamily: "jakaraBold",
                fontSize: 18,
                color,
              }}
            >
              Let's Go
            </Text>
          </Button>
      </View>
    </View>
  );
}
