import colors from "@utils/color";
import { FC } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

interface Props {}

const heading = "Chợ Online";
const subHeading = "Nơi bạn có thể mua bán mọi sản phẩm của bạn";

const WelcomeHeader: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/image.png")}
        style={styles.image}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 350,
  },
  heading: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 5,
    color: colors.primary,
  },
  subHeading: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 14,
    color: colors.primary,
  },
});

export default WelcomeHeader;
