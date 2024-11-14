import { FC } from "react";
import { Text, View, StyleSheet } from "react-native";
import AvatarView from "./AvatarView";
import colors from "@utils/color";

interface Props {
  name: string;
  avatar?: string;
}

const PeerProfile: FC<Props> = ({ name, avatar }) => {
  return (
    <View style={styles.container}>
      <AvatarView size={40} uri={avatar} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: colors.primary,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PeerProfile;
