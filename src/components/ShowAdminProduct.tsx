import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import ProductGridViewAdmin from "./ProductGridViewAdmin";
import { ProductAdmin } from "@views/ShowAllProduct";

interface Props {
  data: ProductAdmin[];
  onPress(product: ProductAdmin): void;
  onLongPress(product: ProductAdmin): void; // Thêm sự kiện nhấn giữ
}

const ShowAdminProduct: FC<Props> = ({ data, onPress, onLongPress }) => {
  return (
    <View style={styles.container}>
      <ProductGridViewAdmin
        data={data}
        onPress={onPress}
        onLongPress={onLongPress} // Truyền hàm nhấn giữ
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ShowAdminProduct;
