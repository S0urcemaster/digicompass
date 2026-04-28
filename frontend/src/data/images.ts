import { CompassImage } from "../types/domain";
import { CATEGORIES } from "./categories";

export const IMAGES: CompassImage[] = [
    {
        id: 0,
        url: "wuerfel hell 1.jpg",
        categories: [CATEGORIES.erkenntnis, CATEGORIES.leben],
        rating: 0
    },
    {
        id: 1,
        url: "wuerfel hell 2.jpg",
        categories: [CATEGORIES.erkenntnis, CATEGORIES.leben],
        rating: 0
    },
    {
        id: 2,
        url: "wuerfel dunkel 1.jpg",
        categories: [CATEGORIES.schicksal, CATEGORIES.leben],
        rating: 0
    },
]