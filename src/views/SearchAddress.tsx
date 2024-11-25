import AppHeader from "@conponents/AppHeader";
import DistrictOptions from "@conponents/DistrictOptions";
import ProvinceOptions from "@conponents/ProvinceOptions";
import BackButton from "@Ui/BackBotton";
import size from "@utils/size";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "react-native-svg";
import colors from "@utils/color";
import useClient from "@hooks/useClient";
import { runAxiosAsync } from "@api/runAxiosAsync";
import SearchProduct from "@conponents/SearchProduct";
import { LatestProduct } from "@conponents/LatesProductList";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "@navigator/AppNavigator";
import { showMessage } from "react-native-flash-message";
import ShowProduct from "@conponents/SearchProduct";
import FormDivider from "@Ui/FormDivider";

type tinh = {
  name: string;
  code?: number;
};

type ProductInfo = {
  provinceName: string;
  districtName?: string;
};

const SearchAddress: React.FC = () => {
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState<string | null>(null);
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const [searchResults, setSearchResults] = useState<LatestProduct[]>([]);

  const { authClient } = useClient();
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    provinceName: "",
  });

  const handleSubmit = async () => {
    // Lấy dữ liệu từ state
    const data = {
      provinceName: productInfo.provinceName,
      districtName: productInfo.districtName,
    };

    if (!data.provinceName) {
      showMessage({ message: "Vui lòng chọn tỉnh", type: "warning" });
    }
    // Kiểm tra dữ liệu trước khi gửi
    if (data.provinceName && data.districtName) {
      const res = await runAxiosAsync<{ results: LatestProduct[] }>(
        authClient.get(
          `/product/search-byaddress/?ProvinceName=${data.provinceName}&DistrictName=${data.districtName}`
        )
      );

      if (res?.results) {
        setSearchResults(res.results);
      } else {
        setSearchResults([]);
      }
    } else {
      const res = await runAxiosAsync<{ results: LatestProduct[] }>(
        authClient.get(
          `/product/search-byaddress/?ProvinceName=${data.provinceName}`
        )
      );

      if (res?.results) {
        setSearchResults(res.results);
      } else {
        setSearchResults([]);
      }
    }
  };

  const handleDistrictSelect = (name: string) => {
    setDistrictName(name);
    setProductInfo((prev) => ({ ...prev, districtName: name }));
  };

  return (
    <>
      <AppHeader backButton={<BackButton />} style={styles.header} />
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <ProvinceOptions
              onSelect={(province: tinh) => {
                setProvinceCode(province.code || null);
                setProvinceName(province.name);
                setProductInfo({ ...productInfo, provinceName: province.name });
              }}
              title={provinceName || "Chọn tỉnh/thành phố"}
            />
          </View>

          <View style={styles.halfWidth}>
            <DistrictOptions
              onSelect={handleDistrictSelect}
              title={districtName || "Chọn quận/huyện"}
              provinceCode={provinceCode}
            />
          </View>
        </View>

        {/* Custom Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            handleSubmit();
          }}
        >
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
        <FormDivider />
        <View>
          <ShowProduct
            title="Sản phẩm ở khu vực bạn đã chọn"
            data={searchResults}
            onPress={({ id }) => navigate("SingleProduct", { id })}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: size.padding,
  },
  header: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SearchAddress;
