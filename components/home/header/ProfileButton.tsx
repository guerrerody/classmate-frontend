import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ProfileIcon } from "../../icons";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { Image } from "expo-image";
import useGetMode from "../../../hooks/GetMode";

type ProfileButtonType = {
  onPress: () => void;
  color: string;
  size: number;
  style?: StyleProp<ViewStyle>;
};
export default function ProfileButton({
  onPress,
  color,
  size,
  style,
}: ProfileButtonType) {
  const imageUri = useAppSelector((state) => state.user.data?.imageUri);
  const dark = useGetMode();
  return (
    <View style={style}>
      <Pressable onPress={onPress}>
        {imageUri ? (
          <Image
            placeholder={
              dark
                ? require("../../../assets/images/profile_white.svg")
                : require("../../../assets/images/profile_black.svg")
            }
            priority={"high"}
            source={{ uri: imageUri }}
            style={{ height: size, width: size, borderRadius: 9999 }}
          />
        ) : (
          <ProfileIcon size={size} color={color} />
        )}
      </Pressable>
    </View>
  );
}
