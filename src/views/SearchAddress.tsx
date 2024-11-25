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

    // Kiểm tra dữ liệu trước khi gửi
    if (data.provinceName && data.districtName) {
      const res = await runAxiosAsync<{ results: LatestProduct[] }>(
        authClient.get(
          `/product/search-byaddress/?ProvinceName=${data.provinceName}&DistrictName=${data.districtName}`
        )
      );

      if (res?.results) {
        console.log("Kết quả từ API:", res);
        setSearchResults(res.results);
      } else {
        console.log("Không có dữ liệu trả về.");
      }
    } else if (data.provinceName) {
      const res = await runAxiosAsync<{ results: LatestProduct[] }>(
        authClient.get(
          `/product/search-byaddress/?ProvinceName=${data.provinceName}`
        )
      );

      if (res?.results) {
        console.log("Kết quả từ API:", res);
        setSearchResults(res.results);
      } else {
        console.log("Không có dữ liệu trả về.");
      }
    } else {
      console.log("Vui lòng nhập tỉnh");
    }
  };

  const handleDistrictSelect = (name: string) => {
    setDistrictName(name);
    setProductInfo((prev) => ({ ...prev, districtName: name }));
  };

  return (
    <View style={styles.container}>
      {/* App Header */}
      <AppHeader backButton={<BackButton />} style={styles.header} />

      {/* Row container for ProvinceOptions and DistrictOptions */}
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
      <View>
        <SearchProduct
          data={searchResults}
          onPress={({ id }) => navigate("SingleProduct", { id })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: size.padding,
  },
  header: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SearchAddress;
