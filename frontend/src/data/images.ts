import type { CompassImage } from "../types/domain";
import { CATEGORIES } from "./categories";

const createImage = (
  id: number,
  url: string,
  color: CompassImage["color"],
  category: CompassImage["categories"][number]
): CompassImage => ({
  id,
  url,
  color,
  categories: [category],
  rating: 0,
});

export const IMAGES: CompassImage[] = [
  createImage(0, "/images/angst dunkel 1.jpg", "dunkel", CATEGORIES.angst),
  createImage(1, "/images/angst hell 1.jpg", "hell", CATEGORIES.angst),
  createImage(2, "/images/angst hell 2.jpg", "hell", CATEGORIES.angst),
  createImage(3, "/images/autonomie dunkel 3.jpg", "dunkel", CATEGORIES.autonomie),
  createImage(4, "/images/autonomie hell 1.jpg", "hell", CATEGORIES.autonomie),
  createImage(5, "/images/autonomie hell 2.jpg", "hell", CATEGORIES.autonomie),
  createImage(6, "/images/bewusstsein hell 1.jpg", "hell", CATEGORIES.bewusstsein),
  createImage(7, "/images/bewusstsein hell 2.jpg", "hell", CATEGORIES.bewusstsein),
  createImage(8, "/images/bewusstsein mix 1.jpg", "mix", CATEGORIES.bewusstsein),
  createImage(9, "/images/denken dunkel 1.jpg", "dunkel", CATEGORIES.denken),
  createImage(10, "/images/denken dunkel 2.jpg", "dunkel", CATEGORIES.denken),
  createImage(11, "/images/denken dunkel 3.jpg", "dunkel", CATEGORIES.denken),
  createImage(12, "/images/spiegel dunkel 1.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(13, "/images/spiegel dunkel 2.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(14, "/images/spiegel dunkel 3.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(15, "/images/spiegel dunkel 4.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(16, "/images/spiegel dunkel 5.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(17, "/images/spiegel dunkel 6.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(18, "/images/spiegel dunkel 7.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(19, "/images/spiegel dunkel 8.jpg", "dunkel", CATEGORIES.spiegel),
  createImage(20, "/images/spiegel dunkel 9.jpg", "dunkel", CATEGORIES.spiegel),
];
