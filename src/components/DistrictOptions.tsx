import OptionSelector from "@views/OptionSelector";
import { FC, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import OptionModal from "./OptionModal";
import AddressOption from "@Ui/AddressOption";
import axios from "axios";

const host = "https://provinces.open-api.vn/api/";
interface Props {
  title: string;
  onSelect(name: string): void;
  provinceCode?: number | null;
  style?: StyleProp<ViewStyle>;
}

const DistrictOptions: FC<Props> = ({ title, onSelect, provinceCode }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [district, setDistrict] = useState<{ name: string; code: number }[]>(
    []
  );

  const fetchAddresses = async (value: number | null) => {
    try {
      if (value != null) {
        const api = await axios.get(`${host}p/${value}?depth=2`);
        const districts = api.data?.districts || []; // Adjust this based on API structure
        setDistrict(districts);
      } else {
        setDistrict([]); // Reset to an empty array if `value` is null
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setDistrict([]); // Handle API errors gracefully
    }
  };
  const handleSubmitProvince = async (name: string) => {
    onSelect(name);
  };
  return (
    <View style={styles.container}>
      <OptionSelector
        title={title}
        onPress={() => {
          if (provinceCode) {
            fetchAddresses(provinceCode); // Fetch data only if `provinceCode` is defined
          } else {
            console.warn("Province code is undefined or null.");
          }
          setShowAddressModal(true);
        }}
      />

      <OptionModal
        visible={showAddressModal}
        onRequestClose={setShowAddressModal}
        options={district || []} // Truyền danh sách địa chỉ vào
        renderItem={(item) => {
          return <AddressOption address={item.name} />;
        }}
        onPress={(item) => handleSubmitProvince(item.name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default DistrictOptions;
