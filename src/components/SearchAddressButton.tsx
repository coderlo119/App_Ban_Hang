import { FC } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "@utils/color";

interface Props {
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
}

const SearchAddressButton: FC<Props> = ({ onPress, style }) => {
  return (
    <Pressable
      onPress={() => {
        onPress && onPress();
      }}
      style={styles.container}
    >
      <Entypo name="address" size={24} color="black" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 43,
    height: 43,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchAddressButton;
