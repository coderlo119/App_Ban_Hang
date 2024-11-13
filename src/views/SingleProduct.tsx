import AppHeader from "@conponents/AppHeader";
import OptionModal from "@conponents/OptionModal";
import ProductDetail from "@conponents/ProductDetail";
import useAuth from "@hooks/useAuth";
import { ProfileNavigatorParamList } from "@navigator/ProfileNavigator";
import BackButton from "@Ui/BackBotton";
import OptionButton from "@Ui/OptionButton";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { Feather, AntDesign } from "@expo/vector-icons";
import colors from "@utils/color";
import useClient from "@hooks/useClient";
import { runAxiosAsync } from "@api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import LoadingSpinner from "@Ui/LoadingSpinner";
import { useDispatch } from "react-redux";
import { deleteItem, Product } from "@store/listings";

type Props = NativeStackScreenProps<ProfileNavigatorParamList, "SingleProduct">;

const menuOption = [
  {
    name: "Edit",
    icon: <Feather name="edit" size={20} color={colors.primary} />,
  },
  {
    name: "Delete",
    icon: <Feather name="trash-2" size={20} color={colors.primary} />,
  },
];
const SingleProduct: FC<Props> = ({ route, navigation }) => {
  const { authState } = useAuth();
  const { authClient } = useClient();
  const [busy, setBusy] = useState(false);
  const [productInfo, setProductInfo] = useState<Product>();
  const dispatch = useDispatch();
  const { product, id } = route.params;
  const [showMenu, setShowMenu] = useState(false);

  const isAdmin = authState.profile?.id === product?.seller.id;

  const confirmDelete = async () => {
    const id = product?.id;
    if (!id) return;
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.delete("/product/" + id)
    );
    setBusy(false);
    if (res?.message) {
      dispatch(deleteItem(id));
      showMessage({ message: res.message, type: "success" });
      navigation.navigate("Listings");
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      "Bạn có chắc muốn xóa sản phẩm không?",
      "Hành động này sẽ xóa vĩnh viễn sản phẩm của bạn mà không thể khôi phục được.",
      [
        { text: "Delete", style: "destructive", onPress: confirmDelete },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const fectchProductInfo = async (id: string) => {
    const res = await runAxiosAsync<{ product: Product }>(
      authClient.get("/product/detail/" + id)
    );
    if (res) {
      setProductInfo(res.product);
    }
  };

  useEffect(() => {
    if (id) fectchProductInfo(id);
    if (product) setProductInfo(product);
  }, [id, product]);
  return (
    <>
      <AppHeader
        backButton={<BackButton />}
        right={
          <OptionButton onPress={() => setShowMenu(true)} visible={isAdmin} />
        }
      />
      <View style={styles.container}>
        {productInfo ? <ProductDetail product={productInfo} /> : <></>}

        <Pressable
          style={styles.messageBtn}
          onPress={() => navigation.navigate("ChatWindow")}
        >
          <AntDesign name="message1" size={20} color={colors.white} />
        </Pressable>
      </View>
      <OptionModal
        options={menuOption}
        renderItem={({ icon, name }) => (
          <View style={styles.option}>
            {icon}
            <Text style={styles.optionTitle}> {name}</Text>
          </View>
        )}
        visible={showMenu}
        onRequestClose={setShowMenu}
        onPress={(option) => {
          if (option.name === "Delete") {
            onDeletePress();
          }
          if (option.name === "Edit") {
            navigation.navigate("EditProduct", { product: product! });
          }
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary,
  },
  messageBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
  },
});

export default SingleProduct;
