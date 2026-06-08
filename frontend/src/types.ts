export type ColorType = 'hell' | 'dunkel' | 'mix';
export type TopView = 'mindset' | 'navigator' | 'collection';
export type CollectionSubview = 'images' | 'sayings' | 'foci' | 'editor';
export type EditorTab = 'foci' | 'mindsets';

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
  foci: Focus[];
  rating: number;
}

export interface PersonalStore {
  sayings: Saying[];
  images: ImageItem[];
  foci: Focus[];
  mindsets: Mindset[];
  activeMindsetId: string | null;
}
