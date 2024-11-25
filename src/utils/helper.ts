import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
export const splitAddress = (address: string) => {
  const split = address.split("_");
  return split[0] || "";
};
export const replacedAddress = (address: string) => {
  const rpAddress = address.replace("_", ", ");
  return rpAddress;
};

export const selectImages = async (
  options?: ImagePicker.ImagePickerOptions
) => {
  let result: string[] = [];
  try {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
      allowsMultipleSelection: true,
      ...options,
    });
    if (assets) {
      result = assets.map(({ uri }) => uri);
    }
  } catch (error) {
    showMessage({ message: (error as any).message, type: "danger" });
  }
  return result;
};

let timeoutId: NodeJS.Timeout;
export const debounce = <T extends any[], R>(
  func: (...args: T) => Promise<R>,
  timeout: number
) => {
  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const res = await func(...args);
        resolve(res);
      }, timeout);
    });
  };
};
