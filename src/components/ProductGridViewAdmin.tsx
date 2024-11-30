import React, { FC } from "react";
import GridViewAdmin from "@views/GridViewAdmin";
import ProductCartAdmin from "@Ui/ProductCartAdmin";
import { ProductAdmin } from "@views/ShowAllProduct";

interface Props {
  data: ProductAdmin[];
  onPress(item: ProductAdmin): void;
  onLongPress(item: ProductAdmin): void; // Thêm sự kiện nhấn giữ
}

const ProductGridViewAdmin: FC<Props> = ({ data, onPress, onLongPress }) => {
  return (
    <GridViewAdmin
      data={data}
      renderItem={(item) => (
        <ProductCartAdmin
          product={item}
          onPress={onPress}
          onLongPress={onLongPress} // Truyền hàm nhấn giữ
        />
      )}
    />
  );
};

export default ProductGridViewAdmin;
