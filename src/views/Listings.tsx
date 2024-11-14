import { runAxiosAsync } from "@api/runAxiosAsync";
import AppHeader from "@conponents/AppHeader";
import useClient from "@hooks/useClient";
import BackButton from "@Ui/BackBotton";
import ProductImage from "@Ui/ProductImage";
import size from "@utils/size";
import React from "react";
import { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileNavigatorParamList } from "@navigator/ProfileNavigator";
import { getListings, Product, updateListings } from "@store/listings";
import { useDispatch, useSelector } from "react-redux";
import colors from "@utils/color";

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

  const fetchListings = async () => {
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
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        {fetching && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loadingIndicator}
          />
        )}
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
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
                <View style={styles.imageContainer}>
                  <ProductImage uri={item.thumbnail} />
                </View>
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
    backgroundColor: "#f0f0f0", // Light gray background
    padding: size.padding,
  },
  listItem: {
    marginBottom: size.padding,
    backgroundColor: colors.lightGrey, // Light background for each item
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden", // Rounds the image corners
  },
  productName: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.textMessage,
    paddingTop: 10,
    textAlign: "left",
  },
  flatList: {
    paddingBottom: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default Listings;
