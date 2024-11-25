import colors from "@utils/color";
import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import ProductGridView from "./ProductGridView";
import { LatestProduct } from "./LatesProductList";

interface Props {
  data: LatestProduct[];
  onPress(product: LatestProduct): void;
}

const SearchProductList: FC<Props> = ({ data, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả tìm kiếm của bạn</Text>
      <ProductGridView data={data} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontWeight: "600",
    color: colors.primary,
    fontSize: 20,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
});

export default SearchProductList;
