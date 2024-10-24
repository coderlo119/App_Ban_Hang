import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import cloudUploader, { cloudApi } from "src/cloud";
import ProductModel from "src/models/product";
import { sendErrorRes } from "src/utils/helper";

const uploadImage = (filePath: string): Promise<UploadApiResponse> => {
  return cloudUploader.upload(filePath, {
    width: 1280,
    height: 720,
    crop: "fill",
  });
};

export const listNewProduct: RequestHandler = async (req, res) => {
  const { name, price, category, description, purchasingDate } = req.body;
  const newProduct = new ProductModel({
    owner: req.user.id,
    name,
    price,
    category,
    description,
    purchasingDate,
  });

  const { images } = req.files;

  const isMultipleImages = Array.isArray(images);

  let invalidFileType = false;

  if (isMultipleImages && images.length > 5) {
    return sendErrorRes(res, "Chỉ có thể tải lên tối đa 5 ảnh!", 422);
  }

  if (isMultipleImages) {
    for (let img of images) {
      if (!img.mimetype?.startsWith("image")) {
        invalidFileType = true;
        break;
      }
    }
  } else {
    if (images)
      if (!images.mimetype?.startsWith("image")) {
        invalidFileType = true;
      }
  }

  if (isMultipleImages) {
    const uploadPromise = images.map((file) => uploadImage(file.filepath));
    const uploadResults = await Promise.all(uploadPromise);
    newProduct.images = uploadResults.map(({ secure_url, public_id }) => {
      return { url: secure_url, id: public_id };
    });

    newProduct.thumbnail = newProduct.images[0].url;
  } else {
    if (images) {
      const { secure_url, public_id } = await uploadImage(images.filepath);
      newProduct.images = [{ url: secure_url, id: public_id }];
      newProduct.thumbnail = secure_url;
    }
  }

  if (invalidFileType)
    return sendErrorRes(res, "File không hợp lệ, file phải là ảnh!", 422);
  await newProduct.save();

  res.status(201).json({ message: "Thêm sản phẩm mới thành công" });
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { name, price, category, description, purchasingDate, thumbnail } =
    req.body;
  const productId = req.params.id;
  if (!isValidObjectId(productId))
    return sendErrorRes(res, "Id sản phẩm không hợp lệ!", 422);
  const product = await ProductModel.findOneAndUpdate(
    {
      _id: productId,
      owner: req.user.id,
    },
    { name, price, category, description, purchasingDate },
    { new: true }
  );
  if (!product) return sendErrorRes(res, "Không tìm thấy sản phẩm!", 404);

  if (typeof thumbnail === "string") product.thumbnail = thumbnail;

  const { images } = req.files;

  const isMultipleImages = Array.isArray(images);

  let invalidFileType = false;

  if (isMultipleImages) {
    if (product.images.length + images.length > 5)
      return sendErrorRes(res, "Chỉ có thể tải lên tối đa 5 ảnh!", 422);
  }

  if (isMultipleImages) {
    for (let img of images) {
      if (!img.mimetype?.startsWith("image")) {
        invalidFileType = true;
        break;
      }
    }
  } else {
    if (images)
      if (!images.mimetype?.startsWith("image")) {
        invalidFileType = true;
      }
  }

  if (isMultipleImages) {
    const uploadPromise = images.map((file) => uploadImage(file.filepath));
    const uploadResults = await Promise.all(uploadPromise);
    const newImages = uploadResults.map(({ secure_url, public_id }) => {
      return { url: secure_url, id: public_id };
    });
    product.images.push(...newImages);
  } else {
    if (images) {
      const { secure_url, public_id } = await uploadImage(images.filepath);
      product.images.push({ url: secure_url, id: public_id });
    }
  }

  if (invalidFileType)
    return sendErrorRes(res, "File không hợp lệ, file phải là ảnh!", 422);
  await product.save();

  res.status(201).json({ message: "Cập nhật sản phẩm thành công" });
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const productId = req.params.id;
  if (!isValidObjectId(productId))
    return sendErrorRes(res, "Id sản phẩm không hợp lệ!", 422);

  const product = await ProductModel.findOneAndDelete({
    _id: productId,
    owner: req.user.id,
  });
  if (!product) return sendErrorRes(res, "Không tìm thấy sản phẩm!", 404);
  const images = product.images;
  if (images.length) {
    const ids = images.map(({ id }) => id);
    await cloudApi.delete_resources(ids);
  }
  res.json({ message: "Xóa sản phẩm thành công" });
};
