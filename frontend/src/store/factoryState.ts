import categories from '../data/categories.json';
import images from '../data/images.json';
import sayings from '../data/sayings.json';
import type {
  CompassImage,
  CompassStoreData,
  DigiCompass,
  Focus,
  Mindset,
  Saying,
} from '../types/domain';

const baseImages = images as CompassImage[];
const baseSayings = sayings as Saying[];

function createFocus(id: number, image: CompassImage, saying: Saying): Focus {
  return {
    id,
    image: { ...image },
    saying: { ...saying },
    rating: Number((((image.id + saying.id) % 5) / 5).toFixed(1)),
    notes: '',
  };
}

function createMindset(id: number, name: string, foci: Focus[]): Mindset {
  return {
    id,
    name,
    foci,
    rating: Number((0.4 + (id % 3) * 0.2).toFixed(1)),
    notes: '',
  };
}

function buildInitialData(): DigiCompass {
  const collectionImages = baseImages.slice(0, 20).map((image, index) => ({
    ...image,
    rating: Number((0.2 + (index % 4) * 0.2).toFixed(1)),
  }));
  const collectionSayings = baseSayings.slice(0, 30).map((saying) => ({ ...saying }));
  const collectionFoci = collectionImages.map((image, index) =>
    createFocus(index, image, collectionSayings[index % collectionSayings.length]),
  );
  const collectionMindsets = Array.from({ length: 5 }, (_, index) =>
    createMindset(
      index,
      `Mindset ${index + 1}`,
      collectionFoci.slice(index * 4, index * 4 + 4),
    ),
  );

  return {
    username: 'Explorer',
    mindsets: collectionMindsets.map((mindset) => ({ ...mindset, foci: [...mindset.foci] })),
    collection: {
      sayings: collectionSayings,
      images: collectionImages,
      foci: collectionFoci,
      mindsets: collectionMindsets,
    },
  };
}

export const factoryState: CompassStoreData = {
  data: buildInitialData(),
  activeView: 'compass',
  activeCollectionSection: 'images',
  selectedMindsetIndex: 0,
  selectedFocusIndex: 0,
};

export const allCategories = categories as string[];
export const libraryImages = baseImages;
export const librarySayings = baseSayings;
