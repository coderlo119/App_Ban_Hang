import colors from "@utils/color";
import { FC } from "react";
import { ColorValue, DimensionValue, StyleSheet, View } from "react-native";

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: ColorValue;
}

const FormDivider: FC<Props> = ({
  width = "50%",
  height = 2,
  backgroundColor = colors.deActive,
}) => {
  return (
    <View style={[styles.container, { width, height, backgroundColor }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

export default FormDivider;
