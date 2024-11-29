import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import Animated, { LinearTransition, ScrollHandlerProcessed } from "react-native-reanimated";

import PostBuilder from "../../../components/home/post/PostBuilder";
import useGetMode from "../../../hooks/GetMode";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { IPost } from "../../../types/api";
import {
  useDeletePostByIdMutation,
  useLazyGetMyPostsQuery,
} from "../../../redux/api/services";
import Bio from "../../../components/profile/Bio";

export default function MyPosts({ onScroll }: Readonly<{ onScroll: ScrollHandlerProcessed<Record<string, unknown>> }>) {
  const dark = useGetMode();
  const authId = useAppSelector((state) => state.user.data?.id);
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [getLazyPost, postRes] = useLazyGetMyPostsQuery();
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState<IPost[]>([]);

  const renderFooter = () => {
    if (postRes.isLoading || isLoading) {
      return (
        <View
          style={{
            height: 50,
            marginTop: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={color} size={20} />
        </View>
      );
    }
  };

  useEffect(() => {
    getLazyPost({ take: 10, skip })
      .unwrap()
      .then((e) => {
        setPosts(e.posts);
        setSkip(e.posts?.length);
      })
      .catch((e) => {
        // dispatch(
        //   openToast({ text: "couldn't get recent posts", type: "Failed" })
        // );
      });
  }, []);

  const fetchMoreData = () => {
    setIsLoading(true);
    if (!noMore && !postRes.error && skip > 0)
      getLazyPost({ take: 10, skip })
        .unwrap()
        .then((e) => {
          console.log(">>>> file: MyPosts.tsx:73 ~ .then ~ e:", e.posts.length);
          setIsLoading(false);
          setPosts((prev) => [...prev, ...e.posts]);
          setSkip(skip + e.posts.length);

          if (e.posts.length < 10) {
            setNoMore(true);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          // dispatch(
          //   openToast({ text: "couldn't get recent posts", type: "Failed" })
          // );
        });
  };

  const [deletePostById] = useDeletePostByIdMutation();

  const deletePost = (id: string) => {
    deletePostById({ id }).then((e) => console.log(e));
    setPosts((prev) => [...prev.filter((prev) => prev.id !== id)]);
  };
  
  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <PostBuilder
      id={item.id}
      myPost={true}
      deletePost={deletePost}
      date={item.createdAt}
      comments={item._count.comments}
      isReposted={!!item?.repostUsers?.find((repostUser) => repostUser?.id === authId)}
      photo={
        item.photo
          ? {
              uri: item.photo?.imageUri,
              width: item.photo?.imageWidth,
              height: item.photo?.imageHeight,
            }
          : undefined
      }
      link={item.link}
      like={item._count.likes}
      thumbNail={item.videoThumbnail}
      isLiked={!!item?.likes?.find((like) => like?.userId === authId)}
      imageUri={item.user?.imageUri}
      name={item.user?.name}
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

  const keyExtractor = (item: IPost) => item.id?.toString();

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        onScroll={onScroll}
        itemLayoutAnimation={LinearTransition.springify()}
        data={posts.length === 0 ? postRes.data?.posts : posts}
        decelerationRate={0.991}
        ListHeaderComponent={<Bio />}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.3}
        onEndReached={fetchMoreData}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
      />
    </View>
  );
}
