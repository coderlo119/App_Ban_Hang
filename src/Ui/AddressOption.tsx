import colors from "@utils/color";
import { FC } from "react";
import { Text, View, StyleSheet } from "react-native";

interface Props {
  address: string;
}

const AddressOption: FC<Props> = ({ address }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.address}>{address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    color: colors.primary,
    paddingVertical: 10,
  },
});

export default AddressOption;
