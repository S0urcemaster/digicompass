import type { CompassImage } from "../types/domain";
import { CATEGORIES } from "./categories";

const getImageColor = (url: string): CompassImage["color"] => {
  if (url.includes(" hell dunkel ")) {
    return "hell dunkel";
  }

  if (url.includes(" dunkel hell ")) {
    return "dunkel hell";
  }

  if (url.includes(" hell ")) {
    return "hell";
  }

  if (url.includes(" dunkel ")) {
    return "dunkel";
  }

  return "neutral";
};

const createImage = (id: number, url: string, category: CompassImage["categories"][number]): CompassImage => ({
  id,
  url,
  color: getImageColor(url),
  categories: [category],
  rating: 0,
});

export const IMAGES: CompassImage[] = [
  createImage(0, "/images/angst dunkel 1.jpg", CATEGORIES.angst),
  createImage(1, "/images/angst hell 1.jpg", CATEGORIES.angst),
  createImage(2, "/images/angst hell 2.jpg", CATEGORIES.angst),
  createImage(3, "/images/autonomie hell 1.jpg", CATEGORIES.autonomie),
  createImage(4, "/images/autonomie hell 2.jpg", CATEGORIES.autonomie),
  createImage(11, "/images/autonomie dunkel 3.jpg", CATEGORIES.autonomie),
  createImage(5, "/images/bewusstsein hell 1.jpg", CATEGORIES.bewusstsein),
  createImage(6, "/images/bewusstsein hell 2.jpg", CATEGORIES.bewusstsein),
  createImage(7, "/images/bewusstsein hell dunkel 1.jpg", CATEGORIES.bewusstsein),
  createImage(8, "/images/denken dunkel 1.jpg", CATEGORIES.denken),
  createImage(9, "/images/denken dunkel 2.jpg", CATEGORIES.denken),
  createImage(10, "/images/denken dunkel 3.jpg", CATEGORIES.denken),
  createImage(12, "/images/erkenntnis 16.jpg", CATEGORIES.erkenntnis),
  createImage(13, "/images/erkenntnis dunkel 1.jpg", CATEGORIES.erkenntnis),
  createImage(14, "/images/erkenntnis dunkel 10.jpg", CATEGORIES.erkenntnis),
  createImage(15, "/images/erkenntnis dunkel 11.jpg", CATEGORIES.erkenntnis),
  createImage(16, "/images/erkenntnis dunkel 12.jpg", CATEGORIES.erkenntnis),
  createImage(17, "/images/erkenntnis dunkel 13.jpg", CATEGORIES.erkenntnis),
  createImage(18, "/images/erkenntnis dunkel 14.jpg", CATEGORIES.erkenntnis),
  createImage(19, "/images/erkenntnis dunkel 15.jpg", CATEGORIES.erkenntnis),
  createImage(20, "/images/erkenntnis dunkel 17.jpg", CATEGORIES.erkenntnis),
  createImage(21, "/images/erkenntnis dunkel 18.jpg", CATEGORIES.erkenntnis),
  createImage(22, "/images/erkenntnis dunkel 2.jpg", CATEGORIES.erkenntnis),
  createImage(23, "/images/erkenntnis dunkel 3.jpg", CATEGORIES.erkenntnis),
  createImage(24, "/images/erkenntnis dunkel 4.jpg", CATEGORIES.erkenntnis),
  createImage(25, "/images/erkenntnis dunkel 5.jpg", CATEGORIES.erkenntnis),
  createImage(26, "/images/erkenntnis dunkel 6.jpg", CATEGORIES.erkenntnis),
  createImage(27, "/images/erkenntnis dunkel 7.jpg", CATEGORIES.erkenntnis),
  createImage(28, "/images/erkenntnis dunkel 8.jpg", CATEGORIES.erkenntnis),
  createImage(29, "/images/erkenntnis dunkel 9.jpg", CATEGORIES.erkenntnis),
  createImage(30, "/images/erkenntnis dunkel hell 1.jpg", CATEGORIES.erkenntnis),
  createImage(31, "/images/erkenntnis dunkel hell 2.jpg", CATEGORIES.erkenntnis),
  createImage(32, "/images/erkenntnis hell 1.jpg", CATEGORIES.erkenntnis),
  createImage(33, "/images/erkenntnis hell 2.jpg", CATEGORIES.erkenntnis),
  createImage(34, "/images/erkenntnis hell 3.jpg", CATEGORIES.erkenntnis),
  createImage(35, "/images/erkenntnis hell 4.jpg", CATEGORIES.erkenntnis),
  createImage(36, "/images/erkenntnis hell 5.jpg", CATEGORIES.erkenntnis),
  createImage(37, "/images/erkenntnis hell 6.jpg", CATEGORIES.erkenntnis),
  createImage(38, "/images/erkenntnis hell 7.jpg", CATEGORIES.erkenntnis),
  createImage(39, "/images/erkenntnis hell 8.jpg", CATEGORIES.erkenntnis),
  createImage(40, "/images/erkenntnis hell 9.jpg", CATEGORIES.erkenntnis),
  createImage(41, "/images/freiheit dunkel 1.jpg", CATEGORIES.freiheit),
  createImage(42, "/images/freiheit dunkel 10.jpg", CATEGORIES.freiheit),
  createImage(43, "/images/freiheit dunkel 11.jpg", CATEGORIES.freiheit),
  createImage(44, "/images/freiheit dunkel 12.jpg", CATEGORIES.freiheit),
  createImage(45, "/images/freiheit dunkel 2.jpg", CATEGORIES.freiheit),
  createImage(46, "/images/freiheit dunkel 3.jpg", CATEGORIES.freiheit),
  createImage(47, "/images/freiheit dunkel 4.jpg", CATEGORIES.freiheit),
  createImage(48, "/images/freiheit dunkel 5.jpg", CATEGORIES.freiheit),
  createImage(49, "/images/freiheit dunkel 6.jpg", CATEGORIES.freiheit),
  createImage(50, "/images/freiheit dunkel 7.jpg", CATEGORIES.freiheit),
  createImage(51, "/images/freiheit dunkel 8.jpg", CATEGORIES.freiheit),
  createImage(52, "/images/freiheit dunkel 9.jpg", CATEGORIES.freiheit),
  createImage(53, "/images/freiheit dunkel hell 1.jpg", CATEGORIES.freiheit),
  createImage(54, "/images/freiheit dunkel hell 2.jpg", CATEGORIES.freiheit),
  createImage(55, "/images/freiheit dunkel hell 3.jpg", CATEGORIES.freiheit),
  createImage(56, "/images/freiheit hell 1.jpg", CATEGORIES.freiheit),
  createImage(57, "/images/freiheit hell 10.jpg", CATEGORIES.freiheit),
  createImage(58, "/images/freiheit hell 11.jpg", CATEGORIES.freiheit),
  createImage(59, "/images/freiheit hell 12.jpg", CATEGORIES.freiheit),
  createImage(60, "/images/freiheit hell 13.jpg", CATEGORIES.freiheit),
  createImage(61, "/images/freiheit hell 14.jpg", CATEGORIES.freiheit),
  createImage(62, "/images/freiheit hell 15.jpg", CATEGORIES.freiheit),
  createImage(63, "/images/freiheit hell 16.jpg", CATEGORIES.freiheit),
  createImage(64, "/images/freiheit hell 17.jpg", CATEGORIES.freiheit),
  createImage(65, "/images/freiheit hell 18.jpg", CATEGORIES.freiheit),
  createImage(66, "/images/freiheit hell 19.jpg", CATEGORIES.freiheit),
  createImage(67, "/images/freiheit hell 2.jpg", CATEGORIES.freiheit),
  createImage(68, "/images/freiheit hell 3.jpg", CATEGORIES.freiheit),
  createImage(69, "/images/freiheit hell 4.jpg", CATEGORIES.freiheit),
  createImage(70, "/images/freiheit hell 5.jpg", CATEGORIES.freiheit),
  createImage(71, "/images/freiheit hell 6.jpg", CATEGORIES.freiheit),
  createImage(72, "/images/freiheit hell 7.jpg", CATEGORIES.freiheit),
  createImage(73, "/images/freiheit hell 8.jpg", CATEGORIES.freiheit),
  createImage(74, "/images/freiheit hell 9.jpg", CATEGORIES.freiheit),
  createImage(75, "/images/gerechtigkeit dunkel 1.jpg", CATEGORIES.gerechtigkeit),
  createImage(76, "/images/gerechtigkeit dunkel 2.jpg", CATEGORIES.gerechtigkeit),
  createImage(77, "/images/gerechtigkeit dunkel 3.jpg", CATEGORIES.gerechtigkeit),
  createImage(78, "/images/gerechtigkeit dunkel 4.jpg", CATEGORIES.gerechtigkeit),
  createImage(79, "/images/gerechtigkeit dunkel 5.jpg", CATEGORIES.gerechtigkeit),
  createImage(80, "/images/gerechtigkeit dunkel 6.jpg", CATEGORIES.gerechtigkeit),
  createImage(81, "/images/gerechtigkeit dunkel 7.jpg", CATEGORIES.gerechtigkeit),
  createImage(82, "/images/gerechtigkeit dunkel 8.jpg", CATEGORIES.gerechtigkeit),
  createImage(83, "/images/gerechtigkeit dunkel hell 1.jpg", CATEGORIES.gerechtigkeit),
  createImage(84, "/images/gerechtigkeit dunkel hell 5.jpg", CATEGORIES.gerechtigkeit),
  createImage(85, "/images/gerechtigkeit dunkel hell 6.jpg", CATEGORIES.gerechtigkeit),
  createImage(86, "/images/gerechtigkeit hell 1.jpg", CATEGORIES.gerechtigkeit),
  createImage(87, "/images/gerechtigkeit hell 2.jpg", CATEGORIES.gerechtigkeit),
  createImage(88, "/images/gerechtigkeit hell 3.jpg", CATEGORIES.gerechtigkeit),
  createImage(89, "/images/gerechtigkeit hell 4.jpg", CATEGORIES.gerechtigkeit),
  createImage(90, "/images/gerechtigkeit hell 5.jpg", CATEGORIES.gerechtigkeit),
  createImage(91, "/images/gerechtigkeit hell 6.jpg", CATEGORIES.gerechtigkeit),
  createImage(92, "/images/gerechtigkeit hell 7.jpg", CATEGORIES.gerechtigkeit),
  createImage(93, "/images/gerechtigkeit hell 8.jpg", CATEGORIES.gerechtigkeit),
  createImage(94, "/images/gerechtigkeit hell dunkel 1.jpg", CATEGORIES.gerechtigkeit),
  createImage(95, "/images/gerechtigkeit hell dunkel 2.jpg", CATEGORIES.gerechtigkeit),
  createImage(96, "/images/gerechtigkeit hell dunkel 3.jpg", CATEGORIES.gerechtigkeit),
  createImage(97, "/images/gerechtigkeit hell dunkel 4.jpg", CATEGORIES.gerechtigkeit),
  createImage(98, "/images/gerechtigkeit hell dunkel 5.jpg", CATEGORIES.gerechtigkeit),
  createImage(99, "/images/gerechtigkeit hell dunkel 6.jpg", CATEGORIES.gerechtigkeit),
  createImage(100, "/images/gerechtigkeit hell dunkel 7.jpg", CATEGORIES.gerechtigkeit),
];
