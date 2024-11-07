import { View, Animated as NativeAnimated } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import PostBuilder from "../../../components/home/post/PostBuilder";

import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";

import { ActivityIndicator } from "react-native-paper";
import { IPost } from "../../../types/api";
import {
  useDeletePostByIdMutation,
  useLazyGetMyPostsQuery,
} from "../../../redux/api/services";
import { openToast } from "../../../redux/slice/toast/toast";

import Bio from "../../../components/profile/Bio";
import Animated, { AnimatedRef, LinearTransition, ScrollHandlerProcessed, SequencedTransition } from "react-native-reanimated";

// PRIMERA ENTREGA. Importar fake posts.
import fakePosts from "../../../data/fakeFollowedPosts.json";

export default function MyPosts({ onScroll }: { onScroll: ScrollHandlerProcessed<Record<string, unknown>> }) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);

  const ref = useRef<any>(null);
  // PRIMERA ENTREGA.
  //const [getLazyPost, postRes] = useLazyGetMyPostsQuery();
  const [isLoading, setIsLoading] = useState(false);

    // PRIMERA ENTREGA. Quitamos el state de post y establecemos el nuevo con fakePosts.
  //const [posts, setPosts] = useState<IPost[]>([]);
  const [posts, setPosts] = useState<IPost[]>(
    fakePosts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }))
  );

  // PRIMERA ENTREGA. NO necesitamos este renderFooter ya que no tendremos More ni Loading. Lo refactorizamos.
  /*
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
  */

  const renderFooter = () => {
    return (
      <View
        style={{
          width: "100%",
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={color} size={20} />
      </View>
    );
  };

  // PRIMERA ENTREGA. NO obtenemos Posts desde API.
  /*
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
  */

  // PRIMERA ENTREGA. NO obtenemos Posts desde API.
  /*
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
  */

  // PRIMERA ENTREGA.
  /*
  const [deletePostById] = useDeletePostByIdMutation();

  const deletePost = (id: string) => {
    deletePostById({ id }).then((e) => console.log(e));
    setPosts((prev) => [...prev.filter((prev) => prev.id !== id)]);
  };
  */
  
  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <>
      <PostBuilder
        id={item.id}
        myPost={true}
        // PRIMERA ENTREGA.
        //deletePost={deletePost}
        deletePost={() => {}}
        date={item.createdAt}
        comments={item._count.comments}
        isReposted={
          item?.repostUser?.find((repostUser) => repostUser?.id === authId)
            ? true
            : false
        }
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
        like={item._count.like}
        thumbNail={item.videoThumbnail}
        isLiked={
          item?.like?.find((like) => like?.userId === authId) ? true : false
        }
        imageUri={item.user?.imageUri}
        name={item.user?.name}
        userTag={item.user?.userName}
        verified={item.user?.verified}
        audioUri={item.audioUri || undefined}
        photoUri={item.photoUri}
        videoTitle={item.videoTitle || undefined}
        videoUri={item.videoUri || undefined}
        postText={item.postText}
        videoViews={item.videoViews?.toString()}
        idx={index}
      />
    </>
  );

  const keyExtractor = (item: IPost) => item.id?.toString();

  // PRIMERA ENTREGA. Refactorizar Render.
  /*
  return (
    <>
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
    </>
  );
  */

  return (
    <>
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          onScroll={onScroll}
          itemLayoutAnimation={LinearTransition.springify()}
          data={posts}
          decelerationRate={0.991}
          ListHeaderComponent={<Bio />}
          ListFooterComponent={renderFooter}
          scrollEventThrottle={16}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        />
      </View>
    </>
  );
}
