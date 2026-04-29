import { IMAGES } from "../data/images";
import { SAYINGS } from "../data/sayings";
import { Focus, Mindset, DigiCompass } from "../types/domain";

const createFocus = (
  sayingIndex: number,
  imageIndex: number,
  rating: number,
  notes: string
): Focus => ({
  saying: SAYINGS[sayingIndex],
  image: IMAGES[imageIndex],
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
    'Fokus',
    [
      [34, 2, 0.84, 'Decision locked. Move forward instead of reopening the same question.'],
      [38, 0, 0.79, 'Use this when priorities need a harder no.'],
      [11, 1, 0.72, 'Keep the before-state visible before trying to improve anything.'],
      [30, 2, 0.8, 'Persistence matters less than aiming at the right target.'],
      [107, 1, 0.83, 'Let intuition speak, but keep reason in the room.'],
    ],
    0.8,
    'Shortlist for clarity, commitment, and disciplined attention.'
  ),
  createMindset(
    'Mut',
    [
      [0, 1, 0.88, 'Courage here means acting while fear is still present.'],
      [7, 2, 0.86, 'Treat fear as part of the process, not evidence to stop.'],
      [9, 0, 0.8, 'Exposure first, confidence second.'],
      [122, 2, 0.81, 'Keep moving even when confidence is not available on demand.'],
      [128, 1, 0.84, 'A living mindset needs some willingness to risk.'],
    ],
    0.84,
    'Examples for action under uncertainty.'
  ),
  createMindset(
    'Wissen',
    [
      [164, 0, 0.82, 'Translate insight into a repeatable capability.'],
      [176, 1, 0.77, 'Keep theory and practice close enough to challenge each other.'],
      [179, 2, 0.74, 'Sharing is part of learning, not a follow-up step.'],
      [161, 0, 0.8, 'Interrogate certainty before calling it knowledge.'],
      [180, 1, 0.78, 'Doubt is productive when it creates room for better links.'],
    ],
    0.79,
    'Sample set for learning, application, and knowledge transfer.'
  ),
  createMindset(
    'Wahrheit',
    [
      [15, 0, 0.87, 'Use when your own thoughts are becoming too convincing.'],
      [58, 1, 0.83, 'Search is healthier than premature certainty.'],
      [64, 2, 0.82, 'Convictions can distort just as effectively as lies.'],
      [115, 1, 0.8, 'Truth becomes practical only when defended against distortion.'],
      [116, 0, 0.85, 'Power without reality-testing is just force.'],
    ],
    0.83,
    'Counterweight against self-deception and borrowed certainty.'
  ),
  createMindset(
    'Schicksal',
    [
      [139, 2, 0.86, 'Accept the shape of events without becoming passive.'],
      [142, 0, 0.8, 'You do not control the cards, only the play.'],
      [143, 1, 0.73, 'Meaning matters more than randomness in this frame.'],
      [44, 2, 0.78, 'Defiance can still be a response to fate.'],
      [157, 1, 0.81, 'Future potential starts inside present imperfection.'],
    ],
    0.8,
    'For situations where acceptance and agency need to coexist.'
  ),
];

const factoryState: DigiCompass = {
  username: 'Guest',
  mindsets: factoryMindsets
};

export default factoryState
