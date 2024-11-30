import React, { FC } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "@utils/color";
import { formatPrice, splitAddress } from "@utils/helper";
import { ProductAdmin } from "@views/ShowAllProduct";

interface Props {
  product: ProductAdmin;
  onPress(item: ProductAdmin): void;
  onLongPress(item: ProductAdmin): void; // Thêm sự kiện nhấn giữ
}

const ProductCartAdmin: FC<Props> = ({ product, onPress, onLongPress }) => {
  return (
    <Pressable
      onPress={() => onPress(product)}
      onLongPress={() => onLongPress(product)} // Xử lý nhấn giữ
      style={styles.productContainer}
    >
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
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{product.name}</Text>
          <View
            style={[
              styles.statusContainer,
              product.isActive ? styles.activeStatus : styles.inactiveStatus,
            ]}
          >
            <Text style={styles.statusText}>
              {product.isActive ? "Bình thường" : "Không hoạt động"}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.address}>{splitAddress(product.address!)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  address: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
    marginTop: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.active,
    marginTop: 5,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 100,
    width: 100,
  },
  statusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  activeStatus: {
    backgroundColor: "#d4edda",
  },
  inactiveStatus: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#155724",
  },
});

export default ProductCartAdmin;
