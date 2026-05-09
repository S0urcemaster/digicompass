import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import imagesData from '../data/images.json';
import sayingsData from '../data/sayings.json';
import { factoryState } from './factoryState';
import type {
  Collection,
  CompassImage,
  CompassStore,
  DigiCompass,
  Focus,
  Mindset,
  Saying,
} from '../types/domain';

const STORAGE_KEY = 'digicompass-store';

const clampRating = (rating: number) => Math.max(0, Math.min(1, rating));

const upsertById = <T extends { id: number | string }>(items: T[], item: T) => {
  const existingIndex = items.findIndex((entry) => entry.id === item.id);
  if (existingIndex === -1) {
    return [...items, item];
  }

  return items.map((entry, index) => (index === existingIndex ? item : entry));
};

const removeById = <T extends { id: number | string }>(items: T[], id: number | string) =>
  items.filter((entry) => entry.id !== id);

const updateCollection = (data: DigiCompass, collection: Collection): DigiCompass => ({
  ...data,
  collection,
});

const syncTopLevelMindsets = (data: DigiCompass, mindsets: Mindset[]): DigiCompass => ({
  ...data,
  mindsets,
  collection: {
    ...data.collection,
    mindsets,
  },
});

const syncMindsetSelection = (mindsets: Mindset[], currentIndex: number) => {
  if (mindsets.length === 0) {
    return 0;
  }

  return Math.min(currentIndex, mindsets.length - 1);
};

const removeFocusFromMindsets = (mindsets: Mindset[], focusId: string) =>
  mindsets.map((mindset) => ({
    ...mindset,
    foci: mindset.foci.filter((focus) => focus.id !== focusId),
  }));

export const useCompassStore = create<CompassStore>()(
  persist(
    (set) => ({
      ...factoryState,
      setActiveView: (activeView) => set({ activeView }),
      setCollectionSection: (collectionSection) => set({ collectionSection }),
      setSelectedMindsetIndex: (selectedMindsetIndex) =>
        set({
          selectedMindsetIndex,
          selectedFocusIndex: 0,
        }),
      setSelectedFocusIndex: (selectedFocusIndex) => set({ selectedFocusIndex }),
      updateUsername: (username) =>
        set((state) => ({
          data: {
            ...state.data,
            username,
          },
        })),
      updateMindsetNotes: (notes) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, index) =>
            index === state.selectedMindsetIndex ? { ...mindset, notes } : mindset,
          );

          return {
            data: {
              ...state.data,
              mindsets,
              collection: {
                ...state.data.collection,
                mindsets,
              },
            },
          };
        }),
      rateCollectionImage: (imageId, rating) =>
        set((state) => {
          const baseImage = state.data.collection.images.find((image) => image.id === imageId);
          const sourceImage = baseImage ?? imagesData.find((image) => image.id === imageId);
          if (!sourceImage) {
            return state;
          }
          const nextImage: CompassImage = { ...sourceImage, id: imageId, rating: clampRating(rating) };
          const images =
            nextImage.rating === 0
              ? removeById(state.data.collection.images, imageId)
              : upsertById(state.data.collection.images, nextImage);

          return {
            data: updateCollection(state.data, {
              ...state.data.collection,
              images,
            }),
          };
        }),
      rateCollectionSaying: (sayingId, rating) =>
        set((state) => {
          const baseSaying = state.data.collection.sayings.find((saying) => saying.id === sayingId);
          const sourceSaying = baseSaying ?? sayingsData.find((saying) => saying.id === sayingId);
          if (!sourceSaying) {
            return state;
          }
          const nextSaying: Saying = { ...sourceSaying, id: sayingId, rating: clampRating(rating) };
          const sayings =
            nextSaying.rating === 0
              ? removeById(state.data.collection.sayings, sayingId)
              : upsertById(state.data.collection.sayings, nextSaying);

          return {
            data: updateCollection(state.data, {
              ...state.data.collection,
              sayings,
            }),
          };
        }),
      saveCollectionFocus: (focus, rating) =>
        set((state) => {
          const nextFocus: Focus = {
            ...focus,
            rating: clampRating(rating),
          };
          const foci =
            nextFocus.rating === 0
              ? removeById(state.data.collection.foci, nextFocus.id)
              : upsertById(state.data.collection.foci, nextFocus);
          const mindsets =
            nextFocus.rating === 0
              ? removeFocusFromMindsets(state.data.collection.mindsets, nextFocus.id)
              : state.data.collection.mindsets.map((mindset) => ({
                  ...mindset,
                  foci: mindset.foci.map((entry) => (entry.id === nextFocus.id ? nextFocus : entry)),
                }));
          const syncedData = syncTopLevelMindsets(state.data, mindsets);

          return {
            data: {
              ...syncedData,
              collection: {
                ...syncedData.collection,
                foci,
              },
            },
            selectedFocusIndex:
              nextFocus.rating === 0
                ? Math.max(0, Math.min(state.selectedFocusIndex, Math.max(0, foci.length - 1)))
                : state.selectedFocusIndex,
          };
        }),
      saveCollectionMindset: (mindset, rating) =>
        set((state) => {
          const nextMindset: Mindset = {
            ...mindset,
            foci: mindset.foci.slice(0, 5),
            rating: clampRating(rating),
          };
          const mindsets =
            nextMindset.rating === 0
              ? removeById(state.data.collection.mindsets, nextMindset.id)
              : upsertById(state.data.collection.mindsets, nextMindset);
          const syncedData = syncTopLevelMindsets(state.data, mindsets);

          return {
            data: syncedData,
            selectedMindsetIndex: syncMindsetSelection(
              syncedData.mindsets,
              state.selectedMindsetIndex,
            ),
            selectedFocusIndex: 0,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        activeView: state.activeView,
        selectedMindsetIndex: state.selectedMindsetIndex,
        selectedFocusIndex: state.selectedFocusIndex,
        collectionSection: state.collectionSection,
      }),
      merge: (persistedState, currentState) => {
        if (import.meta.env.DEV) {
          return currentState;
        }

        const merged = {
          ...currentState,
          ...(persistedState as Partial<CompassStore>),
        };

        const safeMindsetIndex = syncMindsetSelection(
          merged.data.mindsets,
          merged.selectedMindsetIndex,
        );
        const activeFocusCount = merged.data.mindsets[safeMindsetIndex]?.foci.length ?? 0;

        return {
          ...merged,
          selectedMindsetIndex: safeMindsetIndex,
          selectedFocusIndex:
            activeFocusCount === 0 ? 0 : Math.min(merged.selectedFocusIndex, activeFocusCount - 1),
        };
      },
    },
  ),
);
