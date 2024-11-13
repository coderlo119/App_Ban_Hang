import colors from "@utils/color";
import LottieView from "lottie-react-native";
import { FC } from "react";
import { Modal, StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
}

const LoadingSpinner: FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <Modal animationType="fade" transparent>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/Animation - 1730885067200.json")}
          autoPlay
          loop
          style={{ flex: 1, transform: [{ scale: 0.5 }] }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backDrop,
  },
});

export default LoadingSpinner;
