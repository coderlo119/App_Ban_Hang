import { Document, model, Schema } from "mongoose";
import categories from "utils/categories";

type productImage = { url: string; id: string };

export interface ProductDocuument extends Document {
  owner: Schema.Types.ObjectId;
  name: string;
  price: number;
  purchasingDate: Date;
  category: string;
  images: productImage[];
  thumbnail: string;
  description: string;
}

const schema = new Schema<ProductDocuument>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [...categories],
    required: true,
  },
  purchasingDate: {
    type: Date,
    required: true,
  },
  images: [
    {
      type: Object,
      url: String,
      id: String,
    },
  ],
  thumbnail: String,
});

const ProductModel = model("Product", schema);

export default ProductModel;
