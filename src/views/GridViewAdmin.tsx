import { View, StyleSheet, Text } from "react-native";

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
}

const GridViewAdmin = <T extends unknown>(props: Props<T>) => {
  const { data, renderItem } = props;
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View style={styles.itemContainer} key={index}>
            {renderItem(item)}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // Chuyển thành hàng dọc
    width: "100%",
  },
  itemContainer: {
    width: "100%", // Chiếm toàn bộ chiều rộng container
    marginBottom: 10, // Thêm khoảng cách giữa các phần tử
  },
});

export default GridViewAdmin;
