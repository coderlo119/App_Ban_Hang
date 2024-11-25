import OptionSelector from "@views/OptionSelector";
import { FC, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import OptionModal from "./OptionModal";
import AddressOption from "@Ui/AddressOption";
import getProvinces from "@utils/getProvinces";

type tinh = {
  name: string;
  code?: number;
};
interface Props {
  title: string;
  onSelect(provinceName: tinh): void;
  style?: StyleProp<ViewStyle>;
}

const ProvinceOptions: FC<Props> = ({ title, onSelect }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<tinh[]>([]);

  const fetchAddresses = async () => {
    const data = await getProvinces(); // Gọi hàm lấy dữ liệu địa chỉ
    setAddresses(data); // Đảm bảo dữ liệu phù hợp với cấu trúc [{ name: "Hà Nội" }, ...]
  };
  const handleSubmitProvince = async (value: tinh) => {
    onSelect(value);
  };
  return (
    <View style={styles.container}>
      <OptionSelector
        title={title}
        onPress={() => {
          fetchAddresses(); // Lấy dữ liệu trước khi mở modal
          setShowAddressModal(true);
        }}
      />

      <OptionModal
        visible={showAddressModal}
        onRequestClose={setShowAddressModal}
        options={addresses} // Truyền danh sách địa chỉ vào
        renderItem={(item) => {
          return <AddressOption address={item.name} />;
        }}
        onPress={(item) => handleSubmitProvince(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ProvinceOptions;
