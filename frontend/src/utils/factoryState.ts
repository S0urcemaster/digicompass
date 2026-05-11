import type { CompassStoreState, DigiCompass, Focus, Mindset } from '../types/domain';
import { categories, images, sayings } from './data';

function createInitialFoci(): Focus[] {
  return images.slice(0, 5).map((image, index) => ({
    id: index,
    image,
    saying: sayings[index],
    rating: 0.5,
    notes: '',
  }));
}

function createInitialMindsets(foci: Focus[]): Mindset[] {
  return [
    {
      id: 0,
      name: 'Mut im Alltag',
      foci: foci.slice(0, 3),
      rating: 0.6,
      notes: 'Notizen zum aktiven Mindset.',
    },
    {
      id: 1,
      name: 'Klar denken',
      foci: foci.slice(2, 5),
      rating: 0.4,
      notes: 'Zweiter Referenzzustand.',
    },
  ];
}

export function createFactoryData(): DigiCompass {
  const foci = createInitialFoci();
  const mindsets = createInitialMindsets(foci);

  return {
    username: 'demo',
    mindsets,
    collection: {
      sayings: sayings.slice(0, 16),
      images: images.slice(0, 12),
      foci,
      mindsets,
    },
  };
}

export function createFactoryState(): CompassStoreState {
  const firstImageCategory = images[0]?.category ?? categories[0] ?? 'Angst';
  const firstSayingCategory =
    sayings.find((saying) => saying.categories.length > 0)?.categories[0] ?? categories[0] ?? 'Angst';

  return {
    data: createFactoryData(),
    activeView: 'collection',
    selectedMindsetIndex: 0,
    selectedFocusIndex: 0,
    activeCollectionSection: 'images',
    selectedImageCategory: firstImageCategory,
    selectedSayingCategory: firstSayingCategory,
    selectedCollectionImageId: null,
    selectedCollectionSayingId: null,
    selectedCollectionFocusId: null,
    selectedCollectionMindsetId: null,
    activeFociBrowserMode: 'foci',
    activeMindsetsBrowserMode: 'mindsets',
  };
}
