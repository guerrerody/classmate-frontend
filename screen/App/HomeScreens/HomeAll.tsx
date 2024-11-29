import {
  View,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import Fab from "../../../components/home/post/components/Fab";
import { AddIcon } from "../../../components/icons";
import PostBuilder from "../../../components/home/post/PostBuilder";
import { FlashList } from "@shopify/flash-list";
import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { ActivityIndicator } from "react-native-paper";
import { IPost } from "../../../types/api";
import { useLazyGetAllPostsQuery } from "../../../redux/api/services";
import { openToast } from "../../../redux/slice/toast/toast";
import Animated from "react-native-reanimated";
import SkeletonGroupPost from "../../../components/home/misc/SkeletonGroupPost";
import EmptyList from "../../../components/home/misc/EmptyList";

export default function HomeAll() {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  const posts = useAppSelector((state) => state.post);
  
  const isDark = dark;
  const color = !isDark ? "white" : "black";
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [getLazyPost, postRes] = useLazyGetAllPostsQuery({});
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    getLazyPost({ take: 20, skip: 0 })
      .unwrap()
      .then((r) => {});
  }, []);

  const onRefresh = useCallback(() => {
    if (!authId) return;
    setSkip(0);
    setNoMore(false);
    setRefreshing(true);
    getLazyPost({ take: 20, skip: 0 })
      .unwrap()
      .then((e) => {
        setSkip(e.posts.length);
        setRefreshing(false);
        if (e.posts.length === 0) setNoMore(true);
      })
      .catch(() => {
        setRefreshing(false);
        dispatch(
          openToast({ text: "Couldn't get recent posts", type: "Failed" })
        );
      });
  }, [authId, dispatch, getLazyPost]);

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
        </View>
      );
    } else if (posts.loading) {
      return (
        <Animated.View
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

  useEffect(() => {
    getLazyPost({ take: 20, skip })
      .unwrap()
      .then((payload) => {
        setSkip(payload.posts?.length);
      })
      .catch((err) => {
        // dispatch(
        //   openToast({ text: "couldn't get recent posts", type: "Failed" })
        // );
      });
  }, []);

  const fetchMoreData = () => {
    if (!noMore)
      getLazyPost({ take: 20, skip })
        .unwrap()
        .then((payload) => {
          setSkip(skip + payload.posts.length);
          if (payload.posts.length === 0) {
            setNoMore(true);
          }
        })
        .catch((err) => {
          // dispatch(
          //   openToast({ text: "couldn't get recent posts", type: "Failed" })
          // );
        });
  };

  const handleRefetch = () => {
    setSkip(0);
    setNoMore(false);
    getLazyPost({ take: 10, skip: 0 })
      .unwrap()
      .then((payload) => {
        setRefreshing(false);
      })
      .catch((err) => {
        setRefreshing(false);
        // dispatch(
        //   openToast({ text: "couldn't get recent posts", type: "Failed" })
        // );
      });
  };

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <PostBuilder
      id={item.id}
      isReposted={!!item?.repostUsers?.find((repostUser) => repostUser?.id === authId)}
      date={item.createdAt}
      link={item.link}
      comments={item._count?.comments}
      like={item._count?.likes}
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
      thumbNail={item.videoThumbnail}
      imageUri={item.user?.imageUri}
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

  const keyExtractor = (item: IPost) => item?.id?.toString();

  let content;

  if (posts.loading && posts.data.length === 0) {
    content = <SkeletonGroupPost />;
  } else if (posts.data.length === 0) {
    content = <EmptyList handleRefetch={handleRefetch} />;
  } else {
    content = (
      <Animated.View style={{ flex: 1 }}>
        <FlashList
          data={posts?.data}
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
          keyExtractor={keyExtractor}
          estimatedListSize={{ width: width, height: height }}
          onEndReachedThreshold={0.3}
          onEndReached={fetchMoreData}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        />
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
      <Fab item={<AddIcon size={30} color={color} />} />
    </View>
  );
}
