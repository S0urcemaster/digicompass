import type { Focus, ImageItem, Saying } from "../types";

const buildFocus = (
  id: string,
  saying: Saying,
  image: ImageItem,
  rating = 0,
): Focus => ({
  id,
  saying,
  imageUrl: image.url,
  imageColor: image.color,
  imageCategory: image.category,
  rating,
  origin: "factory",
});

export const createFactoryFoci = (
  sayings: Saying[],
  images: ImageItem[],
): Focus[] => {
  const pairs = [
    [0, 5],
    [3, 21],
    [11, 14],
    [15, 13],
    [18, 10],
    [24, 12],
    [28, 4],
    [31, 30],
    [34, 8],
  ];

  return pairs.flatMap(([sayingId, imageId], index) => {
    const saying = sayings.find((entry) => entry.id === sayingId);
    const image = images.find((entry) => entry.id === imageId);

    if (!saying || !image) {
      return [];
    }

    return [buildFocus(`factory-${index}`, saying, image, 0.5)];
  });
};
