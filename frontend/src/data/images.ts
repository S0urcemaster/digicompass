import { CompassImage } from "../types/domain";
import { CATEGORIES } from "./categories";

export const IMAGE_COLORS = {
  dark: "#0e0601",
  bright: "#f1eade",
  red: "#b64444",
  green: "#61c55a",
  blue: "#2c75fb",
} as const;

export const IMAGES: CompassImage[] = [
  {
    id: 0,
    url: "/images/angst dunkel 1.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.angst],
    rating: 0,
  },
  {
    id: 1,
    url: "/images/angst hell 1.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.angst],
    rating: 0,
  },
  {
    id: 2,
    url: "/images/angst hell 2.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.angst],
    rating: 0,
  },
  {
    id: 3,
    url: "/images/autonomie hell 1.jpg",
    color: IMAGE_COLORS.dark,
    categories: [CATEGORIES.autonomie],
    rating: 0,
  },
  {
    id: 4,
    url: "/images/autonomie hell 2.jpg",
    color: IMAGE_COLORS.dark,
    categories: [CATEGORIES.autonomie],
    rating: 0,
  },
  {
    id: 11,
    url: "/images/autonomie dunkel 3.jpg",
    color: IMAGE_COLORS.dark,
    categories: [CATEGORIES.autonomie],
    rating: 0,
  },
  {
    id: 5,
    url: "/images/bewusstsein hell 1.jpg",
    color: IMAGE_COLORS.blue,
    categories: [CATEGORIES.bewusstsein],
    rating: 0,
  },
  {
    id: 6,
    url: "/images/bewusstsein hell 2.jpg",
    color: IMAGE_COLORS.red,
    categories: [CATEGORIES.bewusstsein],
    rating: 0,
  },
  {
    id: 7,
    url: "/images/bewusstsein hell dunkel 1.jpg",
    color: IMAGE_COLORS.green,
    categories: [CATEGORIES.bewusstsein],
    rating: 0,
  },
  {
    id: 8,
    url: "/images/denken dunkel 1.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.denken],
    rating: 0,
  },
  {
    id: 9,
    url: "/images/denken dunkel 2.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.denken],
    rating: 0,
  },
  {
    id: 10,
    url: "/images/denken dunkel 3.jpg",
    color: IMAGE_COLORS.bright,
    categories: [CATEGORIES.denken],
    rating: 0,
  },
];
