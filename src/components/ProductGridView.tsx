import { FC } from "react";
import { LatestProduct } from "./LatesProductList";
import GridView from "@views/GridView";
import ProductCart from "@Ui/ProductCart";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}

const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView
      data={data}
      renderItem={(item) => <ProductCart product={item} onPress={onPress} />}
    />
  );
};

export default ProductGridView;
