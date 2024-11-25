import axios from "axios";

const getProvinces = async () => {
  try {
    const response = await axios.get(
      "https://provinces.open-api.vn/api/?depth=1"
    );

    return response.data; // Trả về danh sách tỉnh/thành phố
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export default getProvinces;
