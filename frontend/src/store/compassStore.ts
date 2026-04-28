import { create } from 'zustand';
import type { DigiCompass, Mindset } from '../types/domain';

interface CompassState {
  data: DigiCompass;
  selectedMindsetIndex: number;
  setUsername: (username: string) => void;
  selectMindset: (index: number) => void;
  addMindset: (mindset: Mindset) => void;
}

const initialState: DigiCompass = {
  username: 'Guest',
  mindsets: [
    {
      name: '',
      foci: [],
      rating: 0,
      notes: ''
    }
  ]
};

export const useCompassStore = create<CompassState>((set) => ({
  data: initialState,
  selectedMindsetIndex: 0,
  setUsername: (username) =>
    set((state) => ({ data: { ...state.data, username } })),
  selectMindset: (selectedMindsetIndex) => set({ selectedMindsetIndex }),
  addMindset: (mindset) =>
    set((state) => ({ data: { ...state.data, mindsets: [...state.data.mindsets, mindset] } }))
}));
