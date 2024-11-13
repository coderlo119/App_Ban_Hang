import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC } from "react";
import Home from "@views/Home";
import Chats from "@views/Chats";
import ProductList from "@views/ProductList";
import SingleProduct from "@views/SingleProduct";
import { Product } from "@store/listings";

export type AppStackParamList = {
  Home: undefined;
  Chats: undefined;
  ProductList: { category: string };
  SingleProduct: { product?: Product; id?: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
