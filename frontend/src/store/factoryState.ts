import imagesData from '../data/images.json';
import sayingsData from '../data/sayings.json';
import type { CompassStoreState, Focus, Mindset } from '../types/domain';

const initialImage = imagesData[0];
const initialSaying = sayingsData[0];

const starterFocus: Focus = {
  id: 'focus-0',
  image: { ...initialImage, rating: 0.8 },
  saying: { ...initialSaying, rating: 0.8 },
  rating: 0.8,
  notes: '',
};

const starterMindset: Mindset = {
  id: 'mindset-0',
  name: 'Erster Kompass',
  foci: [starterFocus],
  rating: 0.8,
  notes: 'Diese Notiz ist der Startpunkt fuer den ersten Mindset-Entwurf.',
};

export const factoryState: CompassStoreState = {
  data: {
    username: 'Guest',
    mindsets: [starterMindset],
    collection: {
      images: [{ ...starterFocus.image }],
      sayings: [{ ...starterFocus.saying }],
      foci: [starterFocus],
      mindsets: [starterMindset],
    },
  },
  activeView: 'compass',
  selectedMindsetIndex: 0,
  selectedFocusIndex: 0,
  collectionSection: 'images',
};
