import colors from "@utils/color";
import size from "@utils/size";
import { FC } from "react";
import { Text, View, StyleSheet } from "react-native";

interface Props {}

const EmptyChatContainer: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Chưa có tin nhắn nào ở đây. Hãy bắt đầu cuộc trò chuyện bằng cách gửi
          tin nhắn đầu tiên để tìm hiểu thêm về sản phẩm, thương lượng giá, hoặc
          hỏi về tình trạng của món đồ. Gợi ý: Hỏi về lịch sử sử dụng, tình
          trạng hiện tại, hoặc đề xuất giá!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: size.padding,
    transform: [{ rotate: "180deg" }, { rotateY: "-180deg" }],
  },
  messageContainer: {
    backgroundColor: colors.lightGrey,
    padding: size.padding,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginVertical: 8,
  },
  message: {
    color: colors.textMessage,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
});

export default EmptyChatContainer;
