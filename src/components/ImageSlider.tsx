import ProductImage from "@Ui/ProductImage";
import colors from "@utils/color";
import { FC, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Text, ViewToken } from "react-native";

interface Props {
  images?: string[];
}

const ImageSlider: FC<Props> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewableConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onViewableItemsChanged = useRef(
    (info: {
      viewableItems: ViewToken<string>[];
      changed: ViewToken<string>[];
    }) => {
      setActiveIndex(info.viewableItems[0].index || 0);
    }
  );
  if (!images?.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatlist}
        data={images}
        renderItem={({ item }) => <ProductImage uri={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfig={viewableConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>
          {activeIndex + 1}/{images?.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  flatlist: {
    position: "relative",
  },
  indicator: {
    position: "absolute",
    width: 35,
    height: 25,
    backgroundColor: colors.backDropDark,
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  indicatorText: { color: colors.white, fontWeight: "600" },
});

export default ImageSlider;
