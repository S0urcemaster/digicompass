import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { factoryState } from './factoryState';
import { clampRating } from '../utils/rating';
import type {
  ActiveView,
  CollectionSection,
  CompassImage,
  CompassStoreData,
  Focus,
  Mindset,
  Saying,
} from '../types/domain';

interface CompassStore extends CompassStoreData {
  setActiveView: (view: ActiveView) => void;
  setActiveCollectionSection: (section: CollectionSection) => void;
  setSelectedMindsetIndex: (index: number) => void;
  setSelectedFocusIndex: (index: number) => void;
  setActiveMindsetNotes: (notes: string) => void;
  rateLibraryImage: (image: CompassImage, rating: number) => void;
  rateLibrarySaying: (saying: Saying, rating: number) => void;
  saveFocus: (focus: Focus) => void;
  rateCollectedFocus: (focusId: number, rating: number) => void;
  saveMindset: (mindset: Mindset) => void;
}

function replaceById<T extends { id: number }>(items: T[], next: T): T[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [...items, next];
  }

  const copy = [...items];
  copy[index] = next;
  return copy;
}

function clampIndex(index: number, size: number): number {
  if (size <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, size - 1));
}

const persistConfig = import.meta.env.DEV
  ? undefined
  : {
      name: 'digicompass-store',
      storage: createJSONStorage(() => localStorage),
    };

const storeImpl = (set: (fn: (state: CompassStore) => Partial<CompassStore>) => void): CompassStore => ({
  ...factoryState,
  setActiveView: (activeView) => set(() => ({ activeView })),
  setActiveCollectionSection: (activeCollectionSection) => set(() => ({ activeCollectionSection })),
  setSelectedMindsetIndex: (index) =>
    set((state) => ({
      selectedMindsetIndex: clampIndex(index, state.data.mindsets.length),
      selectedFocusIndex: 0,
    })),
  setSelectedFocusIndex: (index) =>
    set((state) => ({
      selectedFocusIndex: clampIndex(index, state.data.mindsets[state.selectedMindsetIndex]?.foci.length ?? 0),
    })),
  setActiveMindsetNotes: (notes) =>
    set((state) => {
      const selectedMindset = state.data.mindsets[state.selectedMindsetIndex];
      if (!selectedMindset) {
        return {};
      }

      const nextMindset = { ...selectedMindset, notes };
      return {
        data: {
          ...state.data,
          mindsets: state.data.mindsets.map((mindset, index) =>
            index === state.selectedMindsetIndex ? nextMindset : mindset,
          ),
        },
      };
    }),
  rateLibraryImage: (image, rating) =>
    set((state) => {
      const nextImage = { ...image, rating: clampRating(rating) };
      return {
        data: {
          ...state.data,
          collection: {
            ...state.data.collection,
            images: replaceById(state.data.collection.images, nextImage),
          },
        },
      };
    }),
  rateLibrarySaying: (saying, rating) =>
    set((state) => {
      const nextSaying = { ...saying, rating: clampRating(rating) };
      return {
        data: {
          ...state.data,
          collection: {
            ...state.data.collection,
            sayings: replaceById(state.data.collection.sayings, nextSaying),
          },
        },
      };
    }),
  saveFocus: (focus) =>
    set((state) => {
      const nextFocus = { ...focus, rating: clampRating(focus.rating) };
      return {
        data: {
          ...state.data,
          collection: {
            ...state.data.collection,
            foci: replaceById(state.data.collection.foci, nextFocus),
          },
        },
      };
    }),
  rateCollectedFocus: (focusId, rating) =>
    set((state) => ({
      data: {
        ...state.data,
        collection: {
          ...state.data.collection,
          foci: state.data.collection.foci.map((focus) =>
            focus.id === focusId ? { ...focus, rating: clampRating(rating) } : focus,
          ),
        },
      },
    })),
  saveMindset: (mindset) =>
    set((state) => {
      const nextMindset = { ...mindset, rating: clampRating(mindset.rating) };
      const nextCollectionMindsets = replaceById(state.data.collection.mindsets, nextMindset);
      return {
        data: {
          ...state.data,
          mindsets: replaceById(state.data.mindsets, nextMindset),
          collection: {
            ...state.data.collection,
            mindsets: nextCollectionMindsets,
          },
        },
      };
    }),
});

export const useCompassStore = create<CompassStore>()(
  persistConfig ? persist(storeImpl, persistConfig) : storeImpl,
);
