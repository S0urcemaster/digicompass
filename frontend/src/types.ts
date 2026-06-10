export type ColorType = 'hell' | 'dunkel' | 'mix';
export type TopView = 'primary' | 'navigator' | 'collection';
export type CollectionTab = 'images' | 'sayings' | 'foci' | 'mindsets';

export interface Saying {
  id: number;
  text: string;
  fontSize: number;
  categories: string[];
  source: string[];
  rating: number;
}

export interface ImageItem {
  id: number;
  url: string;
  color: ColorType;
  category: string;
  rating: number;
}

export interface Focus {
  id: string;
  saying: Saying;
  imageUrl: string;
  imageColor: ColorType;
  imageCategory: string;
  rating: number;
  origin: 'factory' | 'user';
}

export interface Mindset {
  id: string;
  name: string;
  foci: Focus[];
  rating: number;
  notes: string;
}

export interface PersonalStore {
  sayings: Saying[];
  images: ImageItem[];
  foci: Focus[];
  mindsets: Mindset[];
  activeMindsetId: string | null;
}
