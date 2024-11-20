import { FC, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  StatusBar,
  FlatList,
  Keyboard,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import colors from "@utils/color";
import size from "@utils/size";
import EmptyView from "@views/EmptyView";
import LottieView from "lottie-react-native";
import { runAxiosAsync } from "@api/runAxiosAsync";
import useAuth from "@hooks/useAuth";
import useClient from "@hooks/useClient";
import { debounce } from "@utils/helper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "@navigator/AppNavigator";

interface Props {
  visible: boolean;
  onClose(visible: boolean): void;
}
const searchResults = [
  { id: 1, name: "iPhone 13 Pro Max" },
  { id: 2, name: "Samsung Galaxy S21 Ultra" },
  { id: 3, name: "MacBook Pro 16-inch" },
  { id: 4, name: "Dell XPS 13" },
  { id: 5, name: "Sony PlayStation 5" },
  { id: 6, name: "Nintendo Switch OLED" },
  { id: 7, name: "Canon EOS R5" },
  { id: 8, name: "Sony A7 III" },
  { id: 9, name: "Bose QuietComfort 45" },
  { id: 10, name: "AirPods Pro" },
  { id: 11, name: "Nike Air Max 270" },
  { id: 12, name: "Adidas Ultraboost 21" },
  { id: 13, name: "Lululemon Align Pants" },
  { id: 14, name: "Patagonia Nano Puff Jacket" },
  { id: 15, name: "Yeti Tundra 45 Cooler" },
  { id: 16, name: "Hydro Flask 32 oz Wide Mouth" },
  { id: 17, name: "Kindle Paperwhite" },
  { id: 18, name: "Fujifilm Instax Mini 11" },
  { id: 19, name: "Anker PowerCore 10000" },
  { id: 20, name: "Google Nest Thermostat" },
];

type SearchResult = {
  id: string;
  name: string;
  thumbnail?: string;
};

const SearchModal: FC<Props> = ({ visible, onClose }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { authClient } = useClient();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const handleClose = () => {
    onClose(!visible);
  };

  const handleOnResultPress = (results: SearchResult) => {
    navigate("SingleProduct", { id: results.id });
    handleClose();
  };

  const searchProduct = async (query: string) => {
    if (query.trim().length >= 3) {
      return await runAxiosAsync<{ results: SearchResult[] }>(
        authClient.get("/product/search?name=" + query)
      );
    }
  };

  const searchDebounce = debounce(searchProduct, 300);

  const handleChange = async (value: string) => {
    setNotFound(false);
    setQuery(value);
    setBusy(true);
    const res = await searchDebounce(value);
    setBusy(false);
    if (res) {
      if (res.results.length) setResults(res.results);
      else setNotFound(true);
    }
  };
  useEffect(() => {
    const keyShowEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyHideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const keyShowListener = Keyboard.addListener(keyShowEvent, (evt) => {
      setKeyboardHeight(evt.endCoordinates.height + 50);
    });
    const keyHideListener = Keyboard.addListener(keyHideEvent, (evt) => {
      setKeyboardHeight(0);
    });

    return () => {
      keyShowListener.remove();
      keyHideListener.remove();
    };
  }, []);

  return (
    <Modal animationType="slide" onRequestClose={handleClose} visible={visible}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={colors.primary}
              />
            </Pressable>
            <View style={styles.searchBar}>
              <SearchBar onChange={handleChange} value={query} />
            </View>
          </View>

          {busy ? (
            <View style={styles.busyIconContainer}>
              <View style={styles.busyAnimationSize}>
                <LottieView
                  style={styles.flex1}
                  autoPlay
                  loop
                  source={require("../../assets/loading_2.json")}
                />
              </View>
            </View>
          ) : null}

          <View style={{ paddingBottom: keyboardHeight }}>
            <FlatList
              data={!busy ? results : []}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleOnResultPress(item)}
                  style={styles.searchResultItem}
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail || undefined}
                  />
                  <Text style={styles.suggestionListItem}>{item.name}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.suggestionList}
              ListEmptyComponent={
                notFound ? (
                  <EmptyView title="Không tìm thấy sản phẩm nào..." />
                ) : null
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: size.padding,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    marginLeft: size.padding,
  },
  suggestionList: {
    padding: size.padding,
  },
  suggestionListItem: {
    color: colors.primary,
    fontWeight: "600",
    paddingVertical: 7,
    fontSize: 18,
  },

  busyIconContainer: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  busyAnimationSize: {
    height: 100,
    width: 100,
  },
  flex1: {
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 40,
    marginRight: 10,
  },
  searchResultItem: {
    flexDirection: "row",
    marginBottom: 7,
  },
});

export default SearchModal;
