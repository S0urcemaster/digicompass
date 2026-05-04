import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Collection, CompassImage, DigiCompass, Focus, Mindset, Rating, Saying } from '../types/domain';
import factoryState from './factoryState';

export type CompassView = 'primary' | 'focus-editor' | 'collection';

interface CompassState {
  data: DigiCompass;
  activeView: CompassView;
  selectedMindsetIndex: number;
  selectedFocusIndex: number;
  setUsername: (username: string) => void;
  setActiveView: (view: CompassView) => void;
  selectMindset: (index: number) => void;
  selectFocus: (index: number) => void;
  addMindset: (mindset: Mindset) => void;
  removeMindset: (index: number) => void;
  updateMindset: (index: number, patch: Partial<Mindset>) => void;
  setMindsetName: (index: number, name: string) => void;
  setMindsetRating: (index: number, rating: Rating) => void;
  addFocus: (mindsetIndex: number, focus: Focus) => void;
  removeFocus: (mindsetIndex: number, focusIndex: number) => void;
  updateFocus: (mindsetIndex: number, focusIndex: number, patch: Partial<Focus>) => void;
  addCollectionImage: (image: CompassImage) => void;
  removeCollectionImage: (imageId: number) => void;
  setCollectionImageRating: (imageId: number, rating: Rating) => void;
  addCollectionSaying: (saying: Saying) => void;
  addCollectionFocus: (focus: Focus) => void;
  setCollectionSayingRating: (sayingId: number, rating: Rating) => void;
  setCollectionFocusRating: (focusKey: string, rating: Rating) => void;
}

const resetFactoryStoreOnReloadInDev = import.meta.env.DEV;

const clampIndex = (index: number, length: number) => {
  if (length <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, length - 1));
};

const cloneCategory = (category: Category): Category => ({
  ...category,
});

const cloneSaying = (saying: Saying): Saying => ({
  ...saying,
  categories: saying.categories.map(cloneCategory),
});

const cloneImage = (image: CompassImage): CompassImage => ({
  ...image,
  categories: image.categories.map(cloneCategory),
});

const cloneFocus = (focus: Focus): Focus => ({
  ...focus,
  saying: cloneSaying(focus.saying),
  image: cloneImage(focus.image),
});

const cloneMindset = (mindset: Mindset): Mindset => ({
  ...mindset,
  foci: mindset.foci.map(cloneFocus),
});

const cloneCollection = (collection: Collection): Collection => ({
  sayings: collection.sayings.map(cloneSaying),
  images: collection.images.map(cloneImage),
  foci: collection.foci.map(cloneFocus),
  mindsets: collection.mindsets.map(cloneMindset),
});

const cloneDigiCompass = (data: DigiCompass): DigiCompass => ({
  username: data.username,
  mindsets: data.mindsets.map(cloneMindset),
  collection: cloneCollection(data.collection),
});

const initialState = cloneDigiCompass(factoryState);

const syncMindsets = (data: DigiCompass, mindsets: Mindset[]): DigiCompass => ({
  ...data,
  mindsets,
  collection: {
    ...data.collection,
    mindsets: mindsets.map(cloneMindset),
  },
});

const getFocusKey = (focus: Focus) => `${focus.saying.id}:${focus.image.id}`;

export const useCompassStore = create<CompassState>()(
  persist(
    (set) => ({
      data: initialState,
      activeView: 'primary',
      selectedMindsetIndex: 0,
      selectedFocusIndex: 0,
      setUsername: (username) => set((state) => ({ data: { ...state.data, username } })),
      setActiveView: (activeView) => set({ activeView }),
      selectMindset: (index) =>
        set((state) => {
          const selectedMindsetIndex = clampIndex(index, state.data.mindsets.length);
          const selectedMindset = state.data.mindsets[selectedMindsetIndex];

          return {
            selectedMindsetIndex,
            selectedFocusIndex: clampIndex(state.selectedFocusIndex, selectedMindset?.foci.length ?? 0),
          };
        }),
      selectFocus: (index) =>
        set((state) => {
          const currentMindset = state.data.mindsets[state.selectedMindsetIndex];

          return {
            selectedFocusIndex: clampIndex(index, currentMindset?.foci.length ?? 0),
          };
        }),
      addMindset: (mindset) =>
        set((state) => {
          const mindsets = [...state.data.mindsets, cloneMindset(mindset)];

          return {
            data: syncMindsets(state.data, mindsets),
          };
        }),
      removeMindset: (index) =>
        set((state) => {
          const mindsets = state.data.mindsets.filter((_, mindsetIndex) => mindsetIndex !== index);
          const selectedMindsetIndex = clampIndex(state.selectedMindsetIndex, mindsets.length);
          const selectedMindset = mindsets[selectedMindsetIndex];

          return {
            data: syncMindsets(state.data, mindsets),
            selectedMindsetIndex,
            selectedFocusIndex: clampIndex(state.selectedFocusIndex, selectedMindset?.foci.length ?? 0),
          };
        }),
      updateMindset: (index, patch) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, mindsetIndex) =>
            mindsetIndex === index ? { ...mindset, ...patch } : mindset
          );

          return {
            data: syncMindsets(state.data, mindsets),
          };
        }),
      setMindsetName: (index, name) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, mindsetIndex) =>
            mindsetIndex === index ? { ...mindset, name } : mindset
          );

          return {
            data: syncMindsets(state.data, mindsets),
          };
        }),
      setMindsetRating: (index, rating) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, mindsetIndex) =>
            mindsetIndex === index ? { ...mindset, rating } : mindset
          );

          return {
            data: syncMindsets(state.data, mindsets),
          };
        }),
      addFocus: (mindsetIndex, focus) =>
        set((state) => {
          const nextFocus = cloneFocus(focus);
          const focusKey = getFocusKey(nextFocus);
          const mindsets = state.data.mindsets.map((mindset, index) =>
            index === mindsetIndex ? { ...mindset, foci: [...mindset.foci, nextFocus] } : mindset
          );
          const collectionFoci = state.data.collection.foci.some((entry) => getFocusKey(entry) === focusKey)
            ? state.data.collection.foci
            : [...state.data.collection.foci, cloneFocus(nextFocus)];

          return {
            data: {
              ...syncMindsets(state.data, mindsets),
              collection: {
                ...syncMindsets(state.data, mindsets).collection,
                foci: collectionFoci,
              },
            },
            selectedMindsetIndex:
              mindsetIndex >= 0 && mindsetIndex < state.data.mindsets.length
                ? mindsetIndex
                : state.selectedMindsetIndex,
            selectedFocusIndex:
              mindsetIndex === state.selectedMindsetIndex
                ? state.data.mindsets[mindsetIndex]?.foci.length ?? state.selectedFocusIndex
                : state.selectedFocusIndex,
          };
        }),
      removeFocus: (mindsetIndex, focusIndex) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, index) =>
            index === mindsetIndex
              ? { ...mindset, foci: mindset.foci.filter((_, currentFocusIndex) => currentFocusIndex !== focusIndex) }
              : mindset
          );
          const selectedMindset = mindsets[state.selectedMindsetIndex];

          return {
            data: syncMindsets(state.data, mindsets),
            selectedFocusIndex: clampIndex(state.selectedFocusIndex, selectedMindset?.foci.length ?? 0),
          };
        }),
      updateFocus: (mindsetIndex, focusIndex, patch) =>
        set((state) => {
          const targetFocus = state.data.mindsets[mindsetIndex]?.foci[focusIndex];

          if (!targetFocus) {
            return state;
          }

          const targetFocusKey = getFocusKey(targetFocus);
          const mindsets = state.data.mindsets.map((mindset, index) =>
            index === mindsetIndex
              ? {
                  ...mindset,
                  foci: mindset.foci.map((focus, currentFocusIndex) =>
                    currentFocusIndex === focusIndex ? { ...focus, ...patch } : focus
                  ),
                }
              : mindset
          );

          return {
            data: {
              ...syncMindsets(state.data, mindsets),
              collection: {
                ...syncMindsets(state.data, mindsets).collection,
                foci: state.data.collection.foci.map((focus) =>
                  getFocusKey(focus) === targetFocusKey ? { ...focus, ...patch } : focus
                ),
              },
            },
          };
        }),
      addCollectionImage: (image) =>
        set((state) => {
          if (state.data.collection.images.some((entry) => entry.id === image.id)) {
            return state;
          }

          return {
            data: {
              ...state.data,
              collection: {
                ...state.data.collection,
                images: [...state.data.collection.images, cloneImage(image)],
              },
            },
          };
        }),
      removeCollectionImage: (imageId) =>
        set((state) => {
          const foci = state.data.collection.foci.filter((focus) => focus.image.id !== imageId);
          const validFocusKeys = new Set(foci.map(getFocusKey));
          const mindsets = state.data.mindsets.filter((mindset) =>
            mindset.foci.every((focus) => validFocusKeys.has(getFocusKey(focus)))
          );

          return {
            data: {
              ...syncMindsets(state.data, mindsets),
              collection: {
                ...syncMindsets(state.data, mindsets).collection,
                images: state.data.collection.images.filter((image) => image.id !== imageId),
                foci,
              },
            },
          };
        }),
      setCollectionImageRating: (imageId, rating) =>
        set((state) => ({
          data: {
            ...state.data,
            collection: {
              ...state.data.collection,
              images: state.data.collection.images.map((image) =>
                image.id === imageId ? { ...image, rating } : image
              ),
            },
          },
        })),
      addCollectionSaying: (saying) =>
        set((state) => {
          if (state.data.collection.sayings.some((entry) => entry.id === saying.id)) {
            return state;
          }

          return {
            data: {
              ...state.data,
              collection: {
                ...state.data.collection,
                sayings: [...state.data.collection.sayings, cloneSaying(saying)],
              },
            },
          };
        }),
      addCollectionFocus: (focus) =>
        set((state) => {
          const nextFocus = cloneFocus(focus);
          const focusKey = getFocusKey(nextFocus);

          if (state.data.collection.foci.some((entry) => getFocusKey(entry) === focusKey)) {
            return state;
          }

          return {
            data: {
              ...state.data,
              collection: {
                ...state.data.collection,
                foci: [...state.data.collection.foci, nextFocus],
              },
            },
          };
        }),
      setCollectionSayingRating: (sayingId, rating) =>
        set((state) => ({
          data: {
            ...state.data,
            collection: {
              ...state.data.collection,
              sayings: state.data.collection.sayings.map((saying) =>
                saying.id === sayingId ? { ...saying, rating } : saying
              ),
            },
          },
        })),
      setCollectionFocusRating: (focusKey, rating) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset) => ({
            ...mindset,
            foci: mindset.foci.map((focus) => (getFocusKey(focus) === focusKey ? { ...focus, rating } : focus)),
          }));

          return {
            data: {
              ...syncMindsets(state.data, mindsets),
              collection: {
                ...syncMindsets(state.data, mindsets).collection,
                foci: state.data.collection.foci.map((focus) =>
                  getFocusKey(focus) === focusKey ? { ...focus, rating } : focus
                ),
              },
            },
          };
        }),
    }),
    {
      name: 'compass-store',
      merge: (persistedState, currentState) =>
        resetFactoryStoreOnReloadInDev
          ? currentState
          : {
              ...currentState,
              ...(persistedState as Partial<CompassState>),
            },
    }
  )
);
