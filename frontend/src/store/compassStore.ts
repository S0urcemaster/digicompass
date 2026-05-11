import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFactoryState } from '../utils/factoryState';
import type { CompassStore, Focus, Mindset } from '../types/domain';

const storageKey = 'digicompass-store';

function clampRating(rating: number) {
  return Math.max(0, Math.min(1, rating));
}

function replaceById<T extends { id: number }>(items: T[], nextItem: T): T[] {
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

function updateCollectionMindsets(mindsets: Mindset[]) {
  return mindsets.map((mindset) => ({
    ...mindset,
    foci: mindset.foci.slice(0, 5),
  }));
}

const initialState = createFactoryState();

export const useCompassStore = create<CompassStore>()(
  persist(
    (set) => ({
      ...initialState,
      setActiveView: (activeView) => set({ activeView }),
      setSelectedMindsetIndex: (selectedMindsetIndex) => set({ selectedMindsetIndex, selectedFocusIndex: 0 }),
      setSelectedFocusIndex: (selectedFocusIndex) => set({ selectedFocusIndex }),
      updateActiveMindsetNotes: (notes) =>
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
                mindsets: updateCollectionMindsets(mindsets),
              },
            },
          };
        }),
      setActiveCollectionSection: (activeCollectionSection) => set({ activeCollectionSection }),
      setSelectedImageCategory: (selectedImageCategory) =>
        set({ selectedImageCategory, selectedCollectionImageId: null }),
      setSelectedSayingCategory: (selectedSayingCategory) =>
        set({ selectedSayingCategory, selectedCollectionSayingId: null }),
      rateImage: (imageId, rating) =>
        set((state) => {
          const nextImage = state.data.collection.images.find((image) => image.id === imageId);
          if (!nextImage) {
            return state;
          }

          const updatedImage = { ...nextImage, rating: clampRating(rating) };
          const nextImages = replaceById(state.data.collection.images, updatedImage);
          return {
            data: {
              ...state.data,
              collection: {
                ...state.data.collection,
                images: nextImages,
              },
            },
          };
        }),
      rateSaying: (sayingId, rating) =>
        set((state) => {
          const nextSaying = state.data.collection.sayings.find((saying) => saying.id === sayingId);
          if (!nextSaying) {
            return state;
          }

          const updatedSaying = { ...nextSaying, rating: clampRating(rating) };
          const nextSayings = replaceById(state.data.collection.sayings, updatedSaying);
          return {
            data: {
              ...state.data,
              collection: {
                ...state.data.collection,
                sayings: nextSayings,
              },
            },
          };
        }),
      rateFocus: (focusId, rating) =>
        set((state) => {
          const nextFocus = state.data.collection.foci.find((focus) => focus.id === focusId);
          if (!nextFocus) {
            return state;
          }

          const updatedFocus: Focus = { ...nextFocus, rating: clampRating(rating) };
          const nextFoci = replaceById(state.data.collection.foci, updatedFocus);
          const nextMindsets = state.data.collection.mindsets.map((mindset) => ({
            ...mindset,
            foci: mindset.foci.map((focus) => (focus.id === updatedFocus.id ? updatedFocus : focus)),
          }));

          return {
            data: {
              ...state.data,
              mindsets: nextMindsets,
              collection: {
                ...state.data.collection,
                foci: nextFoci,
                mindsets: nextMindsets,
              },
            },
          };
        }),
      rateMindset: (mindsetId, rating) =>
        set((state) => {
          const nextMindset = state.data.collection.mindsets.find((mindset) => mindset.id === mindsetId);
          if (!nextMindset) {
            return state;
          }

          const updatedMindset = { ...nextMindset, rating: clampRating(rating) };
          const nextMindsets = replaceById(state.data.collection.mindsets, updatedMindset);
          return {
            data: {
              ...state.data,
              mindsets: nextMindsets,
              collection: {
                ...state.data.collection,
                mindsets: nextMindsets,
              },
            },
          };
        }),
      selectCollectionImage: (selectedCollectionImageId) => set({ selectedCollectionImageId }),
      selectCollectionSaying: (selectedCollectionSayingId) => set({ selectedCollectionSayingId }),
      selectCollectionFocus: (selectedCollectionFocusId) => set({ selectedCollectionFocusId }),
      selectCollectionMindset: (selectedCollectionMindsetId) => set({ selectedCollectionMindsetId }),
      setActiveFociBrowserMode: (activeFociBrowserMode) => set({ activeFociBrowserMode }),
      setActiveMindsetsBrowserMode: (activeMindsetsBrowserMode) => set({ activeMindsetsBrowserMode }),
      createMindsetDraft: () =>
        set((state) => {
          const nextMindset: Mindset = {
            id: Date.now(),
            name: 'Neues Mindset',
            foci: [],
            rating: 0,
            notes: '',
          };
          const nextMindsets = [...state.data.collection.mindsets, nextMindset];
          return {
            data: {
              ...state.data,
              mindsets: nextMindsets,
              collection: {
                ...state.data.collection,
                mindsets: nextMindsets,
              },
            },
            selectedCollectionMindsetId: nextMindset.id,
            activeMindsetsBrowserMode: 'foci',
          };
        }),
      assignFocusToSelectedMindset: (slotIndex, focusId) =>
        set((state) => {
          const selectedMindsetId =
            state.selectedCollectionMindsetId ?? state.data.collection.mindsets[0]?.id ?? null;
          const focus = state.data.collection.foci.find((item) => item.id === focusId);
          if (selectedMindsetId === null || !focus) {
            return state;
          }

          const nextMindsets = state.data.collection.mindsets.map((mindset) => {
            if (mindset.id !== selectedMindsetId) {
              return mindset;
            }

            const nextFoci = mindset.foci.slice(0, 5);
            nextFoci[slotIndex] = focus;
            return { ...mindset, foci: nextFoci.filter(Boolean) };
          });

          return {
            data: {
              ...state.data,
              mindsets: nextMindsets,
              collection: {
                ...state.data.collection,
                mindsets: nextMindsets,
              },
            },
          };
        }),
      updateSelectedMindsetName: (name) =>
        set((state) => {
          const selectedMindsetId =
            state.selectedCollectionMindsetId ?? state.data.collection.mindsets[0]?.id ?? null;
          if (selectedMindsetId === null) {
            return state;
          }

          const nextMindsets = state.data.collection.mindsets.map((mindset) =>
            mindset.id === selectedMindsetId ? { ...mindset, name } : mindset,
          );
          return {
            data: {
              ...state.data,
              mindsets: nextMindsets,
              collection: {
                ...state.data.collection,
                mindsets: nextMindsets,
              },
            },
          };
        }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        activeView: state.activeView,
        selectedMindsetIndex: state.selectedMindsetIndex,
        selectedFocusIndex: state.selectedFocusIndex,
        activeCollectionSection: state.activeCollectionSection,
        selectedImageCategory: state.selectedImageCategory,
        selectedSayingCategory: state.selectedSayingCategory,
        selectedCollectionImageId: state.selectedCollectionImageId,
        selectedCollectionSayingId: state.selectedCollectionSayingId,
        selectedCollectionFocusId: state.selectedCollectionFocusId,
        selectedCollectionMindsetId: state.selectedCollectionMindsetId,
        activeFociBrowserMode: state.activeFociBrowserMode,
        activeMindsetsBrowserMode: state.activeMindsetsBrowserMode,
      }),
      merge: (persistedState, currentState) => {
        if (import.meta.env.DEV) {
          return currentState;
        }

        return {
          ...currentState,
          ...(persistedState as Partial<CompassStore>),
        };
      },
    },
  ),
);

export function useActiveMindset() {
  return useCompassStore((state) => state.data.mindsets[state.selectedMindsetIndex] ?? null);
}
