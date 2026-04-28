import { create } from 'zustand';
import type { CompassImage, DigiCompass, Focus, Mindset } from '../types/domain';
import { SAYINGS } from '../data/sayings';

interface CompassState {
  data: DigiCompass;
  selectedMindsetIndex: number;
  setUsername: (username: string) => void;
  selectMindset: (index: number) => void;
  addMindset: (mindset: Mindset) => void;
}

const dummyImage: CompassImage = {
  id: 0,
  url: '',
  categories: [],
  rating: 0
}

const diceFocus: Focus[] = [
  {
    saying: SAYINGS[34], // Die Würfel sind gefallen
    image: dummyImage,
    rating: 0,
    notes: ''
  }
]

const factoryMindsets: Mindset[] = [
  {
    name: 'Fokus',
    foci: diceFocus,
    rating: 0,
    notes: ''
  }
]

const initialState: DigiCompass = {
  username: 'Guest',
  mindsets: factoryMindsets
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
