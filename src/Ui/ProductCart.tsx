import { FC } from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
import { formatPrice, splitAddress } from "@utils/helper";
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
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={styles.address}>{splitAddress(product.address)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5, // Tạo khoảng cách giữa các sản phẩm
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginVertical: 5,
  },
  address: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
    marginVertical: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.active,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 150,
  },
});

export default ProductCart;
