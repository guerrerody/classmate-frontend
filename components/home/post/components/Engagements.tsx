import { View, Text, useColorScheme, Pressable } from "react-native";
import React, { Ref, useEffect, useRef, useState } from "react";
import LikeButton from "./LikeButton";
import MessageButton from "./MessageButton";
import FavoritesButton from "./FavoritesButton";
import {
  ActivityUnfocused,
  HeartUnfocused,
  HeartsFocused,
  Love,
  MessageUnfocused,
  MessagesIcon,
  ShareUnfocused,
} from "../../../icons";
import useGetMode from "../../../../hooks/GetMode";
import {
  useLazyLikePostQuery,
  useLazyRepostQuery,
} from "../../../../redux/api/services";
import RepostButton from "./RepostButton";

export default function Engagements({
  title,
  like,
  comments,
  isLiked,
  isReposted,
  id,
  handleShare,
}: {
  title?: string;
  like: number;
  comments?: number;
  id: string;
  isLiked: boolean;
  isReposted: boolean;
  handleShare: () => void;
}) {
  const dark = useGetMode();
  const isDark = dark;
  const shareColor = isDark ? "#91EC09" : "#639E0B";
  const [likeAmount, setLikeAmount] = useState(() => like);
  const [clicked, setClicked] = useState(() => isLiked);
  const [likePost] = useLazyLikePostQuery();
  const [rePostPost] = useLazyRepostQuery();

  const [reposted, setRepost] = useState(() => isReposted);

  const handleClicked = (click: boolean) => {
    setClicked(click);
    likePost({ id });
    if (!clicked) {
      setLikeAmount(likeAmount + 1);
    } else {
      setLikeAmount(likeAmount - 1);
    }
  };

  const handleRepost = (repost: boolean) => {
    setRepost(repost);
    rePostPost({ id });
  };

  const color = isDark ? "white" : "black";
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        alignItems: "center",
        gap: 6,
        justifyContent: "space-between",
      }}
    >
      {title && <Text>{title}</Text>}
      <Pressable onPress={handleShare}>
        <ShareUnfocused size={20} color={shareColor} />
      </Pressable>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <LikeButton
          isLiked={isLiked}
          text={likeAmount.toString()}
          clicked={clicked}
          setClicked={handleClicked}
        />
        <MessageButton
          isLiked={false}
          clicked={false}
          setClicked={() => {}}
        />
        {/* <FavoritesButton
          isLiked={isReposted}
          clicked={reposted}
          setClicked={handleRepost}
        /> */}
        <RepostButton
          isPosted={isReposted}
          clicked={reposted}
          setReposted={handleRepost}
        />
      </View>

    </View>
  );
}
