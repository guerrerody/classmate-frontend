import { View, Animated as NativeAnimated } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import PostBuilder from "../../../components/home/post/PostBuilder";

import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";

import { ActivityIndicator } from "react-native-paper";
import { IPost } from "../../../types/api";
import { useLazyGetGuestPostsQuery } from "../../../redux/api/services";

import Bio from "../../../components/profilePeople/Bio";


// PRIMERA ENTREGA. Importar fake posts.
import fakePosts from "../../../data/fakeAllPosts.json";

export default function PeoplePosts({
  offset,
  imageUri,
  userTag,
  name,
  verified,
  id,
}: {
  offset: NativeAnimated.Value;
  imageUri: string;
  userTag: string;
  name: string;
  verified: boolean;
  id: string;
}) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);

  // PRIMERA ENTREGA. Quitamos el state de post y establecemos el nuevo con fakePosts.
  //const [posts, setPosts] = useState<IPost[]>([]);
  const [posts, setPosts] = useState<IPost[]>(
    fakePosts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }))
  );

  const ref = useRef<any>(null);
  
  // PRIMERA ENTREGA.
  //const [getLazyPost, postRes] = useLazyGetGuestPostsQuery();

  // PRIMERA ENTREGA. NO necesitamos este renderFooter ya que no tendremos More ni Loading. Lo refactorizamos.
  /*
  const renderFooter = () => {
    if (postRes.isLoading) {
      return (
        <View
          style={{
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
    getLazyPost({ id, take: 20, skip })
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
    if (!noMore && !postRes.error)
      getLazyPost({ take: 20, skip, id })
        .unwrap()
        .then((e) => {
          setSkip(skip + e.posts.length);

          if (e.posts.length === 0) {
            setNoMore(true);
          }
        })
        .catch((e) => {
          // dispatch(
          //   openToast({ text: "couldn't get recent posts", type: "Failed" })
          // );
        });
  };
  */

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <>
      <PostBuilder
        id={item.id}
        date={item.createdAt}
        link={item.link}
        comments={item._count.comments}
        like={item._count.like}
        thumbNail={item.videoThumbnail}
        isReposted={
          item?.repostUser?.find((repostUser) => repostUser?.id === authId)
            ? true
            : false
        }
        isLiked={
          item?.like?.find((like) => like?.userId === authId) ? true : false
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
        <NativeAnimated.FlatList
          ref={ref}
          data={posts.length === 0 ? postRes.data?.posts : posts}
          decelerationRate={0.991}
          ListHeaderComponent={<Bio name={name} userTag={userTag} id={id} />}
          ListFooterComponent={renderFooter}
          scrollEventThrottle={16}
          onScroll={NativeAnimated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
          )}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          onEndReached={fetchMoreData}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        />
      </View>
    </>
  );
  */

  return (
    <>
      <View style={{ flex: 1 }}>
          <NativeAnimated.FlatList
            ref={ref}
            data={posts}
            decelerationRate={0.991}
            ListHeaderComponent={<Bio name={name} userTag={userTag} id={id} />}
            ListFooterComponent={renderFooter}
            scrollEventThrottle={16}
            onScroll={NativeAnimated.event(
              [{ nativeEvent: { contentOffset: { y: offset } } }],
              { useNativeDriver: false }
            )}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
          />
      </View>
    </>
  );  
}
