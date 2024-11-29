import { View, Animated as NativeAnimated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import PostBuilder from "../../../components/home/post/PostBuilder";
import useGetMode from "../../../hooks/GetMode";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { IPost } from "../../../types/api";
import { useLazyGetGuestPostsQuery } from "../../../redux/api/services";

import Bio from "../../../components/profilePeople/Bio";

export default function PeoplePosts({
  offset,
  imageUri,
  userTag,
  name,
  verified,
  id,
}: Readonly<{
  offset: NativeAnimated.Value;
  imageUri: string;
  userTag: string;
  name: string;
  verified: boolean;
  id: string;
}>) {
  const dark = useGetMode();
  const authId = useAppSelector((state) => state.user.data?.id);
  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const ref = useRef<any>(null);
  const [getLazyPost, postRes] = useLazyGetGuestPostsQuery();

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

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <PostBuilder
      id={item.id}
      date={item.createdAt}
      link={item.link}
      comments={item._count.comments}
      like={item._count.likes}
      thumbNail={item.videoThumbnail}
      isReposted={!!item?.repostUsers?.find((repostUser) => repostUser?.id === authId)}
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
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
      />
    </View>
  );
}
