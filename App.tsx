import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Navigator from "src/navigator";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "@store/index";
import colors from "@utils/color";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
