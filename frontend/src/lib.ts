import type {
  Focus,
  ImageItem,
  Mindset,
  Saying,
} from "./types";

export const clampRating = (value: number) =>
  Math.max(0, Math.min(1, value));

export const ratingSteps = [0.2, 0.4, 0.6, 0.8, 1];

export const getContrastTone = (
  color?: ImageItem["color"],
): "light" | "dark" => {
  if (color === "hell") {
    return "dark";
  }

  return "light";
};

export const focusCategories = (focus: Focus) =>
  Array.from(
    new Set([...focus.saying.categories, focus.imageCategory]),
  ).slice(0, 5);

export const formatCategories = (categories: string[]) =>
  categories.slice(0, 5);

export const imagePath = (url: string) =>
  `/images/${encodeURIComponent(url)}`;

export const createUserFocus = (
  saying: Saying,
  image: ImageItem,
): Focus => ({
  id: `user-focus-${crypto.randomUUID()}`,
  saying,
  imageUrl: image.url,
  imageColor: image.color,
  imageCategory: image.category,
  rating: 0,
  origin: "user",
});

export const createMindset = (foci: Focus[]): Mindset => ({
  id: `mindset-${crypto.randomUUID()}`,
  foci: foci.slice(0, 5),
  rating: 0,
});

export const dedupeById = <T extends { id: string | number }>(
  items: T[],
): T[] => {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
};
