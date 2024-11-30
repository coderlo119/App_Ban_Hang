import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { runAxiosAsync } from "@api/runAxiosAsync";
import useClient from "@hooks/useClient";
import ShowAdminProduct from "@conponents/ShowAdminProduct";
import colors from "@utils/color";

export type ProductAdmin = {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  price: number;
  address: string;
  isActive: boolean;
};

const ShowAllProduct = () => {
  const [listings, setListings] = useState<ProductAdmin[]>([]);
  const { authClient } = useClient();
  const dispatch = useDispatch();

  // Fetch danh sách sản phẩm
  const fetchProducts = async () => {
    const res = await runAxiosAsync<{ data: ProductAdmin[] }>(
      authClient.get("/admin/listings")
    );
    if (res?.data) {
      setListings(res.data);
    }
  };

  // Hàm xử lý khi nhấn giữ
  const handleLongPress = (product: ProductAdmin) => {
    const newStatus = !product.isActive; // Đảo trạng thái hiện tại
    const statusText = newStatus ? "mở khóa" : "khóa"; // Thông báo dựa trên trạng thái

    Alert.alert(
      "Xác nhận",
      `Bạn có muốn ${statusText} sản phẩm "${product.name}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Có",
          onPress: async () => {
            // Gọi API cập nhật trạng thái sản phẩm
            const res = await runAxiosAsync(
              authClient.patch(`/admin/check-active/${product.id}`, {
                isActive: newStatus,
              })
            );
            if (res) {
              // Cập nhật lại danh sách sản phẩm
              setListings((prev) =>
                prev.map((item) =>
                  item.id === product.id
                    ? { ...item, isActive: newStatus }
                    : item
                )
              );
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Danh sách sản phẩm</Text>
      </View>
      <ScrollView style={styles.container}>
        <ShowAdminProduct
          data={listings}
          onPress={() => console.log("Item clicked")}
          onLongPress={handleLongPress} // Truyền hàm xử lý nhấn giữ
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: 15,
    marginLeft: 12,
    marginBottom: 5,
  },
  title: {
    fontWeight: "600",
    color: colors.primary,
    fontSize: 20,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
});

export default ShowAllProduct;
