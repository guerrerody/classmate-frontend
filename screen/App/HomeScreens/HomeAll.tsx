import {
  View,
  Dimensions,
  RefreshControl,
  ViewToken,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
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
import { setPlayingIds } from "../../../redux/slice/post/audio";

// PRIMERA ENTREGA. Importar fake posts.
import fakePosts from "../../../data/fakeAllPosts.json";

export default function HomeAll() {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const authId = useAppSelector((state) => state.user.data?.id);
  
  // PRIMERA ENTREGA. Quitamos el state de post y establecemos el nuevo con fakePosts.
  //const posts = useAppSelector((state) => state.post);
  const [posts, setPosts] = useState<IPost[]>(
    fakePosts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }))
  );
  
  const isDark = dark;
  const color = !isDark ? "white" : "black";
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  // PRIMERA ENTREGA. NO lo necesitamos.
  /*
  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [getLazyPost, postRes] = useLazyGetAllPostsQuery({});
  */
  const [refreshing, setRefreshing] = React.useState(false);

  // PRIMERA ENTREGA. NO obtenemos Posts desde API.
  /*
  useEffect(() => {
    getLazyPost({ take: 20, skip: 0 })
      .unwrap()
      .then((r) => {});
  }, []);
  */

  // PRIMERA ENTREGA. NO hacemos refresh con respecto al API.
  /*
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
  */

  // PRIMERA ENTREGA. Nuevo refresh donde simulamos una pequeña demora para mostrar el refresh.
  const onRefresh = useCallback(() => {
    if (!authId) return;
    setRefreshing(true);
    setTimeout(() => {
      // Refrescar los datos ficticios (simulando un pull-to-refresh)
      setPosts(
        fakePosts.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt), // Asegurarse de convertir a Date al refrescar
        }))
      );
      setRefreshing(false);
    }, 1000);
  }, []);

  // PRIMERA ENTREGA. NO necesitamos este renderFooter ya que no tendremos More ni Loading. Lo refactorizamos.
  /*
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
  */

  // PRIMERA ENTREGA. NO necesitamos fetchMoreData ya que no tendremos More Data
  /*
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
  */

  // PRIMERA ENTREGA. NO necesitamos handleRefetch ya que no tendremos Refetch con el API.
  /*
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
  */

  // PRIMERA ENTREGA. NO necesitamos indexar items de la vista de Posts.
  //const [indexInView, setIndexInView] = useState<Array<number | null>>([]);

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <PostBuilder
      id={item.id}
      isReposted={
        item?.repostUser?.find((repostUser) => repostUser?.id === authId) ? true : false
      }
      date={item.createdAt}
      link={item.link}
      comments={item._count?.comments}
      like={item._count?.like}
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
      thumbNail={item.videoThumbnail}
      imageUri={item.user?.imageUri}
      name={item.user?.name}
      userId={item.user?.id}
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
  );

  const keyExtractor = (item: IPost) => item?.id?.toString();

  // PRIMERA ENTREGA. NO lo necesitamos. Igualmente no se usa.
  /*
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // This means a component is considered visible if at least 50% of it is visible
  };
  */

  // PRIMERA ENTREGA. NO lo necesitamos. Igualmente no se usa.
  /*
  const onViewableItemsChanged = useRef<
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => void
  >(({ viewableItems, changed }) => {
    console.log("Viewable Items:", viewableItems);
    const indexes: Array<number | null> = [];
    viewableItems.map((view) => {
      indexes.push(view.index);
    });
    setIndexInView(indexes);
    dispatch(setPlayingIds(indexes.filter((index): index is number => index !== null)));
    console.log("view", indexes);
    console.log("Changed in this interaction:", changed);
  });
  */

  // PRIMERA ENTREGA. Refactorizar Render.
  /*
  return (
    <View style={{ flex: 1 }}>
      {posts.loading && posts.data.length === 0 ? (
        <SkeletonGroupPost />
      ) : posts.data.length === 0 ? (
        <EmptyList handleRefetch={handleRefetch} />
      ) : (
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
      )}
      <Fab item={<AddIcon size={30} color={color} />} />
    </View>
  );
  */

  return (
    <View style={{ flex: 1 }}>
      {posts.length === 0 ? (
        <EmptyList handleRefetch={onRefresh} />
      ) : (
        <Animated.View style={{ flex: 1 }}>
          <FlashList
            data={posts}
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
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          />
        </Animated.View>
      )}
      <Fab item={<AddIcon size={30} color={color} />} />
    </View>
  );
}
