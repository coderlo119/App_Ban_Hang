import AppHeader from "@conponents/AppHeader";
import BackButton from "@Ui/BackBotton";
import { FC } from "react";
import { View, StyleSheet } from "react-native";

interface Props {}

const ChatWindow: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ChatWindow;
