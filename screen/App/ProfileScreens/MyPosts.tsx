import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import Animated, { LinearTransition, ScrollHandlerProcessed } from "react-native-reanimated";

import PostBuilder from "../../../components/home/post/PostBuilder";
import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { IPost } from "../../../types/api";
import {
  useDeletePostByIdMutation,
  useLazyGetMyPostsQuery,
} from "../../../redux/api/services";
import { openToast } from "../../../redux/slice/toast/toast";
import Bio from "../../../components/profile/Bio";
import { deletePost as deletePostAction } from "../../../redux/slice/post";

export default function MyPosts({ onScroll }: Readonly<{ onScroll: ScrollHandlerProcessed<Record<string, unknown>> }>) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [getLazyPost, postRes] = useLazyGetMyPostsQuery();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [deletePostById] = useDeletePostByIdMutation();

  const handleFetch = (initial = false) => {
    if (!initial && (noMore || isLoading)) return;
    setIsLoading(true);
    getLazyPost({ take: 10, skip: initial ? 0 : skip })
      .unwrap()
      .then(({ posts: newPosts }) => {
        setPosts((prev) => (initial ? newPosts : [...prev, ...newPosts]));
        setSkip((prevSkip) => (initial ? newPosts.length : prevSkip + newPosts.length));
        setNoMore(newPosts.length < 10); // No more data if we receive less than 10
      })
      .catch(() => dispatch(openToast({ text: "Couldn't load posts", type: "Failed" })))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => handleFetch(true), [getLazyPost]);

  const deletePost = (id: string) => {
    deletePostById({ id })
      .then((payload) => {
        setPosts((prev) => prev.filter((post) => post.id !== id));
        dispatch(deletePostAction(id)); // Updates the global status
        console.log(">>>> Delete Post: ", payload);
      })
      .catch(() => dispatch(openToast({ text: "Couldn't delete post", type: "Failed" })));
  };

  const renderFooter = () => {
    if (isLoading) {
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

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        onScroll={onScroll}
        itemLayoutAnimation={LinearTransition.springify()}
        data={posts}
        decelerationRate={0.991}
        ListHeaderComponent={<Bio />}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.3}
        onEndReached={() => handleFetch()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 50 }}
      />
    </View>
  );
}
