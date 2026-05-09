import imageLibrary from '../data/images.json';
import sayingLibrary from '../data/sayings.json';
import type { CompassImage, CompassStoreState, Focus, Mindset, Saying } from './types';

const sayingData = sayingLibrary as Saying[];
const imageData = imageLibrary as CompassImage[];

const createFocus = (saying: Saying, image: CompassImage): Focus => ({
  saying,
  image,
  rating: (saying.rating + image.rating) / 2,
  notes: '',
});

const buildStarterFoci = (): Focus[] => {
  const starterPairs = [
    [0, 0],
    [7, 1],
    [13, 9],
    [15, 12],
    [18, 4],
    [3, 8],
    [11, 6],
    [16, 14],
    [19, 3],
  ];

  return starterPairs.map(([sayingIndex, imageIndex]) =>
    createFocus(sayingData[sayingIndex], imageData[imageIndex]),
  );
};

const buildStarterMindsets = (foci: Focus[]): Mindset[] => [
  {
    name: 'Mut im Alltag',
    foci: foci.slice(0, 5),
    rating: 0.6,
    notes: 'Beobachte, welche Gedanken eine Handlung blockieren und welche sie freisetzen.',
  },
  {
    name: 'Klarheit',
    foci: foci.slice(4, 9),
    rating: 0.5,
    notes: 'Notiere, welche Aussage fuer die aktuelle Situation wirklich traegt.',
  },
];

export const createInitialStoreState = (): CompassStoreState => {
  const collectionFoci = buildStarterFoci();
  const collectionMindsets = buildStarterMindsets(collectionFoci);

  return {
    activeView: 'compass',
    selectedMindsetIndex: 0,
    selectedFocusIndex: 0,
    data: {
      username: 'Guest',
      mindsets: collectionMindsets,
      collection: {
        sayings: sayingData,
        images: imageData,
        foci: collectionFoci,
        mindsets: collectionMindsets,
      },
    },
  };
};
