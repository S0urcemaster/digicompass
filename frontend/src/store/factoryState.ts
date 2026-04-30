import { IMAGES } from "../data/images";
import { SAYINGS } from "../data/sayings";
import { Focus, Mindset, DigiCompass } from "../types/domain";

const getImageById = (imageId: number) => {
  const image = IMAGES.find((entry) => entry.id === imageId);

  if (!image) {
    throw new Error(`Factory state references missing image id ${imageId}.`);
  }

  return image;
};

const createFocus = (
  sayingIndex: number,
  imageId: number,
  rating: number,
  notes: string
): Focus => ({
  saying: SAYINGS[sayingIndex],
  image: getImageById(imageId),
  rating,
  notes,
});

const createMindset = (
  name: string,
  focusSpecs: Array<[number, number, number, string]>,
  rating: number,
  notes: string
): Mindset => ({
  name,
  foci: focusSpecs.map(([sayingIndex, imageIndex, focusRating, focusNotes]) =>
    createFocus(sayingIndex, imageIndex, focusRating, focusNotes)
  ),
  rating,
  notes,
});

const factoryMindsets: Mindset[] = [
  createMindset(
    'Angst',
    [
      [0, 0, 0.89, 'Fear is present, but action still happens.'],
      [1, 1, 0.86, 'Useful when failure is being imagined before anything has happened.'],
      [5, 2, 0.83, 'Exposure reduces fear more reliably than avoidance.'],
      [7, 1, 0.88, 'Courage is not the absence of fear but movement through it.'],
      [9, 0, 0.82, 'Facing fear repeatedly makes it smaller.'],
    ],
    0.86,
    'Examples for fear, exposure, and courage under tension.'
  ),
  createMindset(
    'Autonomie',
    [
      [189, 3, 0.87, 'Autonomy starts by seeing dependence clearly.'],
      [112, 4, 0.84, 'Self-rule matters before trying to direct anyone else.'],
      [19, 11, 0.82, 'Own excuses are usually the first constraint to remove.'],
      [30, 11, 0.8, 'Independence needs a chosen direction, not just persistence.'],
      [152, 4, 0.85, 'Agency becomes visible in the options you create.'],
    ],
    0.84,
    'Examples for agency, self-direction, and responsibility.'
  ),
  createMindset(
    'Bewusstsein',
    [
      [43, 5, 0.86, 'Awareness improves when you have something that reflects you back.'],
      [81, 6, 0.81, 'Do not lose sight of yourself while managing everything else.'],
      [147, 7, 0.84, 'Reflection is uncomfortable precisely when it matters.'],
      [148, 5, 0.83, 'The act of honest self-observation is already change.'],
      [163, 6, 0.8, 'Perception and understanding shape each other.'],
    ],
    0.83,
    'Examples for reflection, self-observation, and awareness.'
  ),
  createMindset(
    'Denken',
    [
      [13, 8, 0.86, 'Too much attention to outside judgment distorts your thinking.'],
      [97, 9, 0.79, 'Thought is useful when it serves judgment rather than vanity.'],
      [98, 10, 0.84, 'Thinking without action is incomplete.'],
      [100, 9, 0.8, 'Good judgment includes knowing when to confront a problem.'],
      [156, 8, 0.78, 'Clear thinking often returns when the noise drops.'],
    ],
    0.81,
    'Examples for judgment, thought, and disciplined reasoning.'
  ),
];

const factoryState: DigiCompass = {
  username: 'Guest',
  mindsets: factoryMindsets
};

export default factoryState
