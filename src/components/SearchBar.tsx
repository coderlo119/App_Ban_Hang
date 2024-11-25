import { FC } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import colors from "@utils/color";
import React from "react";

interface Props {
  asButton?: boolean;
  onPress?(): void;
  onChange?(text: string): void;
  style?: StyleProp<ViewStyle>;
  value?: string;
}
const handleSubmit = async () => {};

const SearchBar: FC<Props> = ({ asButton, onChange, value, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {asButton ? (
        <View style={styles.textInput}>
          <Text style={styles.fakePlaceholder}>Tìm kiếm...</Text>
        </View>
      ) : (
        <TextInput
          placeholder="Tìm kiếm..."
          style={[styles.textInput, styles.textInputFont]}
          autoFocus
          onChangeText={onChange}
          value={value}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
  },
  textInput: {
    paddingLeft: 10,
    flex: 1,
  },
  textInputFont: {
    color: colors.primary,
    fontSize: 18,
  },
  fakePlaceholder: {
    color: colors.primary,
    fontSize: 18,
    opacity: 0.5,
    fontWeight: "200",
  },
  searchContainer: {
    flexDirection: "row",
  },
});

export default SearchBar;
