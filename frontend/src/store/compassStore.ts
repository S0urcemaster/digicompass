import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DigiCompass, Mindset } from '../types/domain';
import factoryState from './factoryState';

interface CompassState {
  data: DigiCompass;
  selectedMindsetIndex: number;
  setUsername: (username: string) => void;
  selectMindset: (index: number) => void;
  addMindset: (mindset: Mindset) => void;
}

const initialState: DigiCompass = factoryState;

export const useCompassStore = create<CompassState>()(
  persist(
    (set) => ({
      data: initialState,
      selectedMindsetIndex: 0,
      setUsername: (username) => set((state) => ({ data: { ...state.data, username } })),
      selectMindset: (selectedMindsetIndex) => set({ selectedMindsetIndex }),
      addMindset: (mindset) =>
        set((state) => ({
          data: { ...state.data, mindsets: [...state.data.mindsets, mindset] },
        })),
    }),
    {
      name: 'compass-store',
    }
  )
);
