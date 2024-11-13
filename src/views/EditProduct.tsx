import AppHeader from "@conponents/AppHeader";
import HorizontalImageList from "@conponents/HorizontailImageList";
import { ProfileNavigatorParamList } from "@navigator/ProfileNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@Ui/BackBotton";
import colors from "@utils/color";
import size from "@utils/size";
import React, { useState } from "react";
import { FC } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import FormInput from "@Ui/FormInput";
import DatePicker from "@Ui/DatePicker";
import OptionSelector from "./OptionSelector";
import OptionModal from "@conponents/OptionModal";
import useClient from "@hooks/useClient";
import { runAxiosAsync } from "@api/runAxiosAsync";
import { selectImages } from "@utils/helper";
import CategoryOptions from "@conponents/CategoryOptions";
import AppButton from "@Ui/AppButton";
import { newProductSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import LoadingSpinner from "@Ui/LoadingSpinner";
import deepEqual from "deep-equal";

type Props = NativeStackScreenProps<ProfileNavigatorParamList, "EditProduct">;

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
};

const imageOptions = [
  { value: "Chọn là ảnh thumnail", id: "thumb" },
  { value: "Xoá ảnh", id: "remove" },
];

const EditProduct: FC<Props> = ({ route }) => {
  const productInfoToUpdate = {
    ...route.params.product,
    price: route.params.product?.price.toString(),
    date: new Date(route.params.product.date),
  };

  const [selectedImage, setSelectedImage] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [product, setProduct] = useState({ ...productInfoToUpdate });
  const { authClient } = useClient();

  const isFormChanged = deepEqual(productInfoToUpdate, product);

  const onLongPress = (image: string) => {
    setSelectedImage(image);
    setShowImageOptions(true);
  };
  const removeSelectedImage = async () => {
    const notLocalImage = selectedImage.startsWith(
      "https://res.cloudinary.com"
    );

    const images = product.image;
    const newImages = images?.filter((img) => img !== selectedImage);
    setProduct({ ...product, image: newImages });

    if (notLocalImage) {
      const splitedItems = selectedImage.split("/");
      const imageId = splitedItems[splitedItems.length - 1].split(".")[0];
      await runAxiosAsync(
        authClient.delete(`/product/image/${product?.id}/${imageId}`)
      );
    }
  };

  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    const oldImages = product.image || [];
    const images = oldImages.concat(newImages);
    setProduct({ ...product, image: [...images] });
  };
  const makeSelectedImageAsThumbnail = () => {
    if (selectedImage.startsWith("https://res.cloudinary.com")) {
      setProduct({ ...product, thumbnail: selectedImage });
    }
  };

  const handleOnSubmit = async () => {
    const dataToUpdate: ProductInfo = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      purchasingDate: product.date,
    };
    const { error } = await yupValidate(newProductSchema, dataToUpdate);
    if (error) return showMessage({ message: error, type: "danger" });

    const formData = new FormData();
    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }

    type productInfoKeys = keyof typeof dataToUpdate;

    for (let key in dataToUpdate) {
      const value = dataToUpdate[key as productInfoKeys];
      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    const images: { uri: string; type: string; name: string }[] = [];

    product.image?.forEach((img, index) => {
      if (!img.startsWith("https://res.cloudinary.com"))
        formData.append("images", {
          uri: img,
          name: "image_" + index,
          type: mime.getType(img) || "image/jpg",
        } as any);
    });
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.patch("/product/" + product.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };
  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Ảnh sản phẩm</Text>

          <HorizontalImageList
            images={product?.image || []}
            onLongPress={onLongPress}
          />

          <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>
          <FormInput
            placeholder="Tên sản phẩm"
            value={product.name}
            onChangeText={(name) => setProduct({ ...product, name })}
          />

          <FormInput
            placeholder="Giá sản phẩm"
            keyboardType="numeric"
            value={product.price?.toString()}
            onChangeText={(price) => setProduct({ ...product, price })}
          />

          <DatePicker
            value={product.date}
            title="Ngày mua"
            onChange={(date) => setProduct({ ...product, date })}
          />
          <CategoryOptions
            onSelect={(category) => setProduct({ ...product, category })}
            title={product.category || "Category"}
          />

          <FormInput
            placeholder="Mô tả"
            value={product?.description}
            onChangeText={(description) =>
              setProduct({ ...product, description })
            }
          />
          {!isFormChanged && (
            <AppButton title="Cập nhật sản phẩm" onPress={handleOnSubmit} />
          )}
        </ScrollView>
      </View>
      <OptionModal
        options={imageOptions}
        visible={showImageOptions}
        onRequestClose={setShowImageOptions}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id }) => {
          if (id === "thumb") makeSelectedImageAsThumbnail();
          if (id === "remove") removeSelectedImage();
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});

export default EditProduct;
