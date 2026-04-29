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

const factoryMindsets: Mindset[] = [
  {
    name: 'Fokus',
    foci: [
      createFocus(34, 2, 0.84, 'Decision locked. Move forward instead of reopening the same question.'),
      createFocus(38, 0, 0.79, 'Use this when priorities need a harder no.'),
      createFocus(11, 1, 0.72, 'Keep the before-state visible before trying to improve anything.'),
    ],
    rating: 0.78,
    notes: 'Shortlist for clarity, commitment, and disciplined attention.',
  },
  {
    name: 'Mut',
    foci: [
      createFocus(0, 1, 0.88, 'Courage here means acting while fear is still present.'),
      createFocus(7, 2, 0.86, 'Treat fear as part of the process, not evidence to stop.'),
      createFocus(9, 0, 0.8, 'Exposure first, confidence second.'),
    ],
    rating: 0.85,
    notes: 'Examples for action under uncertainty.',
  },
  {
    name: 'Wissen',
    foci: [
      createFocus(164, 0, 0.82, 'Translate insight into a repeatable capability.'),
      createFocus(176, 1, 0.77, 'Keep theory and practice close enough to challenge each other.'),
      createFocus(179, 2, 0.74, 'Sharing is part of learning, not a follow-up step.'),
    ],
    rating: 0.78,
    notes: 'Sample set for learning, application, and knowledge transfer.',
  },
];

const factoryState: DigiCompass = {
  username: 'Guest',
  mindsets: factoryMindsets
};

export default factoryState
