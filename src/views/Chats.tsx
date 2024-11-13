import AppHeader from "@conponents/AppHeader";
import BackButton from "@Ui/BackBotton";
import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const Chats: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Chats;
