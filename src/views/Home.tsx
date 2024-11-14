import { runAxiosAsync } from "@api/runAxiosAsync";
import CategoryList from "@conponents/CategoryList";
import LatesProductList, { LatestProduct } from "@conponents/LatesProductList";
import SearchBar from "@conponents/SearchBar";
import useAuth from "@hooks/useAuth";
import useClient from "@hooks/useClient";
import { AppStackParamList } from "@navigator/AppNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ChatNotification from "@Ui/ChatNotification";
import size from "@utils/size";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import socket, { handleSocketConnection } from "src/socket/ndex";

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchLatestProduct();
  }, []);
  useEffect(() => {
    if (authState.profile) handleSocketConnection(authState.profile, dispatch);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <ChatNotification onPress={() => navigate("Chats")} />
      <ScrollView style={styles.container}>
        <SearchBar />
        <CategoryList
          onPress={(category) => navigate("ProductList", { category })}
        />
        <LatesProductList
          data={products}
          onPress={({ id }) => navigate("SingleProduct", { id })}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
});

export default Home;
