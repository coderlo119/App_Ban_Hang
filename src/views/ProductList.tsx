import { runAxiosAsync } from "@api/runAxiosAsync";
import AppHeader from "@conponents/AppHeader";
import { LatestProduct } from "@conponents/LatesProductList";
import ProductGridView from "@conponents/ProductGridView";
import useClient from "@hooks/useClient";
import { AppStackParamList } from "@navigator/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@Ui/BackBotton";
import colors from "@utils/color";
import size from "@utils/size";
import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import EmptyView from "./EmptyView";
import ProductCart from "@Ui/ProductCart";
import React from "react";

type Props = NativeStackScreenProps<AppStackParamList, "ProductList">;

const col = 2;

const ProductList: FC<Props> = ({ route, navigation }) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const { category } = route.params;

  const isOdd = products.length % col !== 0;

  const fetchProducts = async (category: string) => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/by-category/" + category)
    );
    if (res) {
      setProducts(res.products);
    }
  };
  useEffect(() => {
    fetchProducts(category);
  }, [category]);
  if (!products.length)
    return (
      <View style={styles.container}>
        <AppHeader
          backButton={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />
        <EmptyView title="Không có sản phẩm nào thuộc danh mục này!" />
      </View>
    );
  return (
    <>
      <AppHeader
        backButton={<BackButton />}
        center={<Text style={styles.title}>{category}</Text>}
      />
      <View style={styles.container}>
        <FlatList
          numColumns={col}
          data={products}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: isOdd && index === products.length - 1 ? 1 / col : 1,
              }}
            >
              <ProductCart
                product={item}
                onPress={({ id }) =>
                  navigation.navigate("SingleProduct", { id })
                }
              />
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    color: colors.primary,
    paddingBottom: 5,
    fontSize: 18,
  },
});

export default ProductList;
