export type Rating = number;

export type ActiveView = 'navigator' | 'compass' | 'collection';
export type CollectionSection = 'images' | 'sayings' | 'foci' | 'mindsets';
export type FocusBrowserMode = 'foci' | 'images' | 'sayings';
export type MindsetBrowserMode = 'mindsets' | 'foci';

export interface Saying {
  id: number;
  text: string;
  fontSize: number;
  categories: string[];
  rating: Rating;
}

export interface CompassImage {
  id: number;
  url: string;
  color: string;
  category: string;
  rating: Rating;
}

export interface Focus {
  id: number;
  saying: Saying;
  image: CompassImage;
  rating: Rating;
  notes: string;
}

export interface Mindset {
  id: number;
  name: string;
  foci: Focus[];
  rating: Rating;
  notes: string;
}

export interface Collection {
  sayings: Saying[];
  images: CompassImage[];
  foci: Focus[];
  mindsets: Mindset[];
}

export interface DigiCompass {
  username: string;
  mindsets: Mindset[];
  collection: Collection;
}

export interface CompassStoreData {
  data: DigiCompass;
  activeView: ActiveView;
  activeCollectionSection: CollectionSection;
  selectedMindsetIndex: number;
  selectedFocusIndex: number;
}
