import colors from "@utils/color";
import { FC } from "react";
import { Pressable, StyleSheet, Text, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  title: string;
  active?: boolean;
  onPress?(): void;
}

const AppButton: FC<Props> = ({ title, active = true, onPress }) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={[styles.button, active ? styles.btnActive : styles.btnDeActive]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btnDeActive: {
    backgroundColor: colors.deActive,
  },
  title: {
    color: colors.white,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default AppButton;
