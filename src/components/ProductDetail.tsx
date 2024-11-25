import AvatarView from "@Ui/AvatarView";
import colors from "@utils/color";
import { formatDate } from "@utils/date";
import { formatPrice, replacedAddress } from "@utils/helper";
import size from "@utils/size";
import { FC } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import ImageSlider from "./ImageSlider";
import FormDivider from "@Ui/FormDivider";
import { Product2 } from "@views/Listings";

interface Props {
  product: Product2;
}

const ProductDetail: FC<Props> = ({ product }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageSlider images={product.image} />

      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.date}>
        Mua ngày: {formatDate(product.date, "dd, LLL, yyyy")}
      </Text>

      <Text style={styles.description}>{replacedAddress(product.address)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <FormDivider />

      <View style={styles.profileContainer}>
        <AvatarView uri={product.seller.avatar} size={60} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{product.seller.name}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  category: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.7,
  },
  price: {
    marginTop: 10,
    color: colors.active,
    fontWeight: "700",
    fontSize: 24,
  },
  date: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  name: {
    marginTop: 15,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 1,
  },
  description: {
    marginTop: 15,
    color: colors.primary,
    fontSize: 15,
    lineHeight: 22,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profileTextContainer: {
    paddingLeft: 15,
  },
  profileName: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ProductDetail;
