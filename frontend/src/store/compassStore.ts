import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DigiCompass, Focus, Mindset, Rating } from '../types/domain';
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
}

const initialState: DigiCompass = factoryState;
const resetFactoryStoreOnReloadInDev = import.meta.env.DEV;

const clampIndex = (index: number, length: number) => {
  if (length <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, length - 1));
};

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
        set((state) => ({
          data: { ...state.data, mindsets: [...state.data.mindsets, mindset] },
        })),
      removeMindset: (index) =>
        set((state) => {
          const mindsets = state.data.mindsets.filter((_, mindsetIndex) => mindsetIndex !== index);
          const selectedMindsetIndex = clampIndex(state.selectedMindsetIndex, mindsets.length);
          const selectedMindset = mindsets[selectedMindsetIndex];

          return {
            data: { ...state.data, mindsets },
            selectedMindsetIndex,
            selectedFocusIndex: clampIndex(state.selectedFocusIndex, selectedMindset?.foci.length ?? 0),
          };
        }),
      updateMindset: (index, patch) =>
        set((state) => ({
          data: {
            ...state.data,
            mindsets: state.data.mindsets.map((mindset, mindsetIndex) =>
              mindsetIndex === index ? { ...mindset, ...patch } : mindset
            ),
          },
        })),
      setMindsetName: (index, name) =>
        set((state) => ({
          data: {
            ...state.data,
            mindsets: state.data.mindsets.map((mindset, mindsetIndex) =>
              mindsetIndex === index ? { ...mindset, name } : mindset
            ),
          },
        })),
      setMindsetRating: (index, rating) =>
        set((state) => ({
          data: {
            ...state.data,
            mindsets: state.data.mindsets.map((mindset, mindsetIndex) =>
              mindsetIndex === index ? { ...mindset, rating } : mindset
            ),
          },
        })),
      addFocus: (mindsetIndex, focus) =>
        set((state) => ({
          data: {
            ...state.data,
            mindsets: state.data.mindsets.map((mindset, index) =>
              index === mindsetIndex ? { ...mindset, foci: [...mindset.foci, focus] } : mindset
            ),
          },
          selectedMindsetIndex:
            mindsetIndex >= 0 && mindsetIndex < state.data.mindsets.length
              ? mindsetIndex
              : state.selectedMindsetIndex,
          selectedFocusIndex:
            mindsetIndex === state.selectedMindsetIndex
              ? state.data.mindsets[mindsetIndex]?.foci.length ?? state.selectedFocusIndex
              : state.selectedFocusIndex,
        })),
      removeFocus: (mindsetIndex, focusIndex) =>
        set((state) => {
          const mindsets = state.data.mindsets.map((mindset, index) =>
            index === mindsetIndex
              ? { ...mindset, foci: mindset.foci.filter((_, currentFocusIndex) => currentFocusIndex !== focusIndex) }
              : mindset
          );
          const selectedMindset = mindsets[state.selectedMindsetIndex];

          return {
            data: { ...state.data, mindsets },
            selectedFocusIndex: clampIndex(state.selectedFocusIndex, selectedMindset?.foci.length ?? 0),
          };
        }),
      updateFocus: (mindsetIndex, focusIndex, patch) =>
        set((state) => ({
          data: {
            ...state.data,
            mindsets: state.data.mindsets.map((mindset, index) =>
              index === mindsetIndex
                ? {
                    ...mindset,
                    foci: mindset.foci.map((focus, currentFocusIndex) =>
                      currentFocusIndex === focusIndex ? { ...focus, ...patch } : focus
                    ),
                  }
                : mindset
            ),
          },
        })),
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
