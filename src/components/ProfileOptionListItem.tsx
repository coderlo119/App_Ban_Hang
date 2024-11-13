import { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/color";

interface Props {
  antIconName: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
  onPress?(): void;
}

const ProfileOptionListItem: FC<Props> = ({
  style,
  antIconName,
  title,
  onPress,
  active,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.buttonContainer}>
        <AntDesign
          name={antIconName as any}
          size={24}
          color={active ? colors.active : colors.primary}
        />
        <Text
          style={[
            styles.title,
            { color: active ? colors.active : colors.primary },
          ]}
        >
          {title}
        </Text>
      </View>
      {active && <View style={styles.indicator} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.active,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
  },
});

export default ProfileOptionListItem;
