import { View, Text, Dimensions, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import Fab from "../../../components/home/post/components/Fab";
import { AddIcon } from "../../../components/icons";
import PostBuilder from "../../../components/home/post/PostBuilder";
import { openToast } from "../../../redux/slice/toast/toast";
import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { IPost } from "../../../types/api";
import { useLazyGetFollowedPostsQuery } from "../../../redux/api/services";
import SkeletonGroupPost from "../../../components/home/misc/SkeletonGroupPost";
import EmptyList from "../../../components/home/misc/EmptyList";
import { resetPost } from "../../../redux/slice/post/followed";
import { resetPost as resetAllPosts } from "../../../redux/slice/post";

export default function HomeFollowed() {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  const posts = useAppSelector((state) => state.followedPost);

  const isDark = dark;
  const color = !isDark ? "white" : "black";
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [getLazyPost, postRes] = useLazyGetFollowedPostsQuery({});

  const fetchPosts = async (reset = false) => {
    if (reset) {
      dispatch(resetPost());
      setSkip(0);
      setNoMore(false);
    }
    try {
      const response = await getLazyPost({ take: 20, skip: reset ? 0 : skip }).unwrap();
      if (reset) {
        setSkip(response.posts.length);
      } else { 
        setSkip((prev) => prev + response.posts.length);
      }
      setNoMore(response.posts.length < 20); // No more data if we receive less than 20
    } catch {
      dispatch(openToast({ text: "Couldn't fetch posts", type: "Failed" }));
    }
  };

  useEffect(() => {
    dispatch(resetAllPosts()); // Reset all posts
    fetchPosts(true); // Load initial posts
  }, [dispatch, getLazyPost]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(true).finally(() => setRefreshing(false));
  }, []);

  const fetchMoreData = () => {
    if (!noMore) {
      fetchPosts();
    }
  };

  const renderFooter = () => {
    if (noMore) {
      return (
        <View
          style={{
            width: "100%",
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
           <Text>No more posts</Text>
        </View>
      );
    } else if (posts.loading) {
      return (
        <Animated.View
          exiting={FadeOut.duration(50)}
          entering={FadeIn.duration(50)}
          style={{
            marginTop: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={color} size={20} />
        </Animated.View>
      );
    }
  };

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <PostBuilder
      id={item.id}
      isReposted={!!item?.repostUsers?.find((repostUser) => repostUser?.id === authId)}
      date={item.createdAt}
      link={item.link}
      comments={item._count.comments}
      like={item._count.likes}
      isLiked={!!item?.likes?.find((like) => like?.userId === authId)}
      photo={
        item.photo
          ? {
              uri: item.photo?.imageUri,
              width: item.photo?.imageWidth,
              height: item.photo?.imageHeight,
            }
          : undefined
      }
      imageUri={item.user?.imageUri}
      thumbNail={item.videoThumbnail}
      name={item.user?.name}
      userId={item.user?.id}
      userTag={item.user?.userName}
      verified={item.user?.verified}
      audioUri={item.audioUri ?? undefined}
      photoUri={item.photoUri}
      videoTitle={item.videoTitle ?? undefined}
      videoUri={item.videoUri ?? undefined}
      postText={item.postText}
      videoViews={item.videoViews?.toString()}
      idx={index}
    />
  );

  const renderContent = () => {
    if (posts.loading && posts.data.length === 0) {
      return <SkeletonGroupPost />;
    } else if (posts.data.length === 0) {
      return <EmptyList handleRefetch={onRefresh} />;
    }
    return (
      <Animated.View style={{ flex: 1 }}>
        <FlashList
          data={posts.data}
          decelerationRate={0.991}
          estimatedItemSize={100}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["red", "blue"]}
            />
          }
          keyExtractor={(item) => item.id.toString()}
          estimatedListSize={{ width, height }}
          onEndReachedThreshold={0.3}
          onEndReached={fetchMoreData}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 50 }}
        />
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderContent()} 
      <Fab item={<AddIcon size={30} color={color} />} />
    </View>
  );
}
