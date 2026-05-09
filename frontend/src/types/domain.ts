export type Rating = number;
export type ActiveView = 'navigator' | 'compass' | 'collection';
export type CollectionSection = 'images' | 'sayings' | 'foci' | 'mindsets';

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
  id: string;
  saying: Saying;
  image: CompassImage;
  rating: Rating;
  notes: string;
}

export interface Mindset {
  id: string;
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

export interface CompassStoreState {
  data: DigiCompass;
  activeView: ActiveView;
  selectedMindsetIndex: number;
  selectedFocusIndex: number;
  collectionSection: CollectionSection;
}

export interface CompassStoreActions {
  setActiveView: (view: ActiveView) => void;
  setCollectionSection: (section: CollectionSection) => void;
  setSelectedMindsetIndex: (index: number) => void;
  setSelectedFocusIndex: (index: number) => void;
  updateUsername: (username: string) => void;
  updateMindsetNotes: (notes: string) => void;
  rateCollectionImage: (imageId: number, rating: Rating) => void;
  rateCollectionSaying: (sayingId: number, rating: Rating) => void;
  saveCollectionFocus: (focus: Focus, rating: Rating) => void;
  saveCollectionMindset: (mindset: Mindset, rating: Rating) => void;
}

export type CompassStore = CompassStoreState & CompassStoreActions;
