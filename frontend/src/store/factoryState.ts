import { IMAGES } from "../data/images";
import { SAYINGS } from "../data/sayings";
import type { DigiCompass, Focus, Mindset } from "../types/domain";

const getImageById = (imageId: number) => {
  const image = IMAGES.find((entry) => entry.id === imageId);

  if (!image) {
    throw new Error(`Factory state references missing image id ${imageId}.`);
  }

  return image;
};

const getSayingById = (sayingId: number) => {
  const saying = SAYINGS.find((entry) => entry.id === sayingId);

  if (!saying) {
    throw new Error(`Factory state references missing saying id ${sayingId}.`);
  }

  return saying;
};

const createFocus = (
  sayingId: number,
  imageId: number,
  rating: number,
  notes: string
): Focus => ({
  saying: getSayingById(sayingId),
  image: getImageById(imageId),
  rating,
  notes,
});

const createMindset = (
  name: string,
  focusIndexes: number[],
  collectionFoci: Focus[],
  rating: number,
  notes: string
): Mindset => ({
  name,
  foci: focusIndexes.map((focusIndex) => {
    const focus = collectionFoci[focusIndex];

    if (!focus) {
      throw new Error(`Factory state references missing collection focus index ${focusIndex}.`);
    }

    return focus;
  }),
  rating,
  notes,
});

const collectionSayingIds = [
  0, 3, 11, 15, 18, 23, 30, 38, 45, 52,
  57, 64, 71, 80, 92, 103, 117, 131, 152, 180,
];

const collectionImageIds = [
  0, 1, 3, 5, 8, 12, 13, 16, 20, 24,
  30, 32, 35, 41, 44, 48, 53, 57, 63, 71,
];

const collectionFocusSpecs: Array<[number, number, number, string]> = [
  [0, 57, 0.81, "A sharp saying on a bright freedom image keeps the tension useful."],
  [15, 13, 0.78, "Doubt and dark atmosphere work well together here."],
  [23, 3, 0.84, "Small causes and large effects fit this open scene."],
  [38, 41, 0.76, "The short line gives the image room to breathe."],
  [52, 30, 0.82, "This pairing feels strange on purpose and works as a prompt."],
  [71, 8, 0.73, "Time and shadow create a steady, reflective focus."],
  [92, 63, 0.88, "Action-first language fits the lighter upward image."],
  [103, 24, 0.79, "Learning through pain fits a darker, more compressed frame."],
  [131, 5, 0.85, "Reason and courage land well on a clean autonomy image."],
  [180, 48, 0.8, "Doubt-driven knowledge benefits from the heavier freedom tone."],
];

const collectionSayings = collectionSayingIds.map(getSayingById);
const collectionImages = collectionImageIds.map((imageId) => ({
  ...getImageById(imageId),
  rating: 0.5,
}));
const collectionFoci = collectionFocusSpecs.map(([sayingId, imageId, rating, notes]) =>
  createFocus(sayingId, imageId, rating, notes)
);

const factoryMindsets: Mindset[] = [
  createMindset(
    "Signal",
    [0, 3, 6, 8, 9],
    collectionFoci,
    0.82,
    "A mixed set for movement, choice, and forward pressure."
  ),
  createMindset(
    "Widerstand",
    [1, 4, 5, 7, 9],
    collectionFoci,
    0.79,
    "Built from darker pairings and more friction-heavy sayings."
  ),
  createMindset(
    "Klarheit",
    [2, 3, 6, 8, 9],
    collectionFoci,
    0.86,
    "A slightly cleaner set that still keeps some tension."
  ),
];

const factoryState: DigiCompass = {
  username: "Guest",
  mindsets: factoryMindsets,
  collection: {
    sayings: collectionSayings,
    images: collectionImages,
    foci: collectionFoci,
    mindsets: factoryMindsets,
  },
};

export default factoryState;
