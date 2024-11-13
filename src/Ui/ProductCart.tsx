import { FC } from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
import { formatPrice } from "@utils/helper";
import colors from "@utils/color";
import { MaterialIcons } from "@expo/vector-icons";
import { LatestProduct } from "@conponents/LatesProductList";

interface Props {
  product: LatestProduct;
  onPress(item: LatestProduct): void;
}

const ProductCart: FC<Props> = ({ product, onPress }) => {
  return (
    <Pressable onPress={() => onPress(product)} style={styles.productContainer}>
      {product.thumbnail ? (
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.noImageView]}>
          <MaterialIcons
            name="image-not-supported"
            size={25}
            color={colors.primary}
          />
        </View>
      )}
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={styles.name}>{product.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    padding: 7,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductCart;
