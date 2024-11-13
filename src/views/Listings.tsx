import { runAxiosAsync } from "@api/runAxiosAsync";
import AppHeader from "@conponents/AppHeader";
import useClient from "@hooks/useClient";
import BackButton from "@Ui/BackBotton";
import ProductImage from "@Ui/ProductImage";
import size from "@utils/size";
import React from "react";
import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileNavigatorParamList } from "@navigator/ProfileNavigator";
import { getListings, Product, updateListings } from "@store/listings";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

type ListingResponse = {
  products: Product[];
};

const Listings: FC<Props> = (props) => {
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const [fetching, setFetching] = useState(false);
  const { authClient } = useClient();
  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const fecthListings = async () => {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    setFetching(false);
    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fecthListings();
  }, []);
  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          refreshing={fetching}
          onRefresh={fecthListings}
          data={listings}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => navigate("SingleProduct", { product: item })}
                style={styles.listItem}
              >
                <ProductImage uri={item.thumbnail} />
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
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
  listItem: {
    paddingBottom: size.padding,
  },
  productName: {
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10,
  },
  flatList: {
    paddingBottom: 20,
  },
});

export default Listings;
