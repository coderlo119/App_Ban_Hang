import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  ActiveChat,
  addNewActiveChats,
  getUnreadChatsCount,
} from "@store/chats";
import { useDispatch, useSelector } from "react-redux";
import size from "@utils/size";
import ChatNotification from "@Ui/ChatNotification";
import socket, { handleSocketConnection } from "src/socket";
import { runAxiosAsync } from "@api/runAxiosAsync";
import CategoryList from "@conponents/CategoryList";
import LatesProductList, { LatestProduct } from "@conponents/LatesProductList";
import SearchBar from "@conponents/SearchBar";
import SearchAddressButton from "@conponents/SearchAddressButton";
import SearchModal from "@conponents/SearchModal";
import useAuth from "@hooks/useAuth";
import useClient from "@hooks/useClient";
import { AppStackParamList } from "@navigator/AppNavigator";
import ShowProduct from "@conponents/SearchProduct";

interface Props {}

const Home: FC<Props> = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [productsByAddress, setProductsByAddress] = useState<LatestProduct[]>();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatsCount);

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };
  const fetchProductByAddress = async () => {
    const res = await runAxiosAsync<{ results: LatestProduct[] }>(
      authClient.get("/product/get-byaddress")
    );
    if (res?.results) {
      setProductsByAddress(res.results);
    }
  };

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{ chats: ActiveChat[] }>(
      authClient("/conversation/last-chats")
    );

    if (res) {
      dispatch(addNewActiveChats(res.chats));
    }
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      fetchProductByAddress();
      await fetchLatestProduct();
      await fetchLastChats();
    };
    handleApiRequest();
  }, []);

  useEffect(() => {
    if (authState.profile) handleSocketConnection(authState.profile, dispatch);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar asButton onPress={() => setShowSearchModal(true)} />
        </View>
        <View style={styles.searchAddressButtonContainer}>
          <SearchAddressButton
            onPress={() => {
              navigate("SearchAddress");
            }}
          />
        </View>
        <ChatNotification
          onPress={() => navigate("Chats")}
          indicate={totalUnreadMessages > 0}
        />
      </View>
      <ScrollView style={styles.container}>
        <CategoryList
          onPress={(category) => navigate("ProductList", { category })}
        />
        {productsByAddress ? (
          <ShowProduct
            title="Sản phẩm gần bạn"
            data={productsByAddress}
            onPress={({ id }) => navigate("SingleProduct", { id })}
          />
        ) : null}
        <LatesProductList
          data={products}
          onPress={({ id }) => navigate("SingleProduct", { id })}
        />
      </ScrollView>
      <SearchModal visible={showSearchModal} onClose={setShowSearchModal} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: 15,
    marginLeft: 12,
    marginBottom: 5,
  },
  searchBarContainer: {
    flex: 6, // Chiếm phần lớn không gian ngang
    marginRight: 13,
    marginLeft: 5,
  },
  searchAddressButtonContainer: {
    flex: 1, // Chiếm không gian ngang tương đương với chatNotification
    alignItems: "flex-end", // Canh phải (nếu cần)
  },
});

export default Home;
