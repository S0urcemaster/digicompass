export type ViewName = 'navigator' | 'compass' | 'collection';
export type CollectionSection = 'images' | 'sayings' | 'foci' | 'mindsets';
export type FociBrowserMode = 'foci' | 'images' | 'sayings';
export type MindsetsBrowserMode = 'mindsets' | 'foci';

export interface Saying {
  id: number;
  text: string;
  fontSize: number;
  categories: string[];
  rating: number;
}

export interface CompassImage {
  id: number;
  url: string;
  color: 'hell' | 'dunkel' | 'mix';
  category: string;
  rating: number;
}

export interface Focus {
  id: number;
  saying: Saying;
  image: CompassImage;
  rating: number;
  notes: string;
}

export interface Mindset {
  id: number;
  name: string;
  foci: Focus[];
  rating: number;
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
  activeView: ViewName;
  selectedMindsetIndex: number;
  selectedFocusIndex: number;
  activeCollectionSection: CollectionSection;
  selectedImageCategory: string;
  selectedSayingCategory: string;
  selectedCollectionImageId: number | null;
  selectedCollectionSayingId: number | null;
  selectedCollectionFocusId: number | null;
  selectedCollectionMindsetId: number | null;
  activeFociBrowserMode: FociBrowserMode;
  activeMindsetsBrowserMode: MindsetsBrowserMode;
}

export interface CompassStoreActions {
  setActiveView: (view: ViewName) => void;
  setSelectedMindsetIndex: (index: number) => void;
  setSelectedFocusIndex: (index: number) => void;
  updateActiveMindsetNotes: (notes: string) => void;
  setActiveCollectionSection: (section: CollectionSection) => void;
  setSelectedImageCategory: (category: string) => void;
  setSelectedSayingCategory: (category: string) => void;
  rateImage: (imageId: number, rating: number) => void;
  rateSaying: (sayingId: number, rating: number) => void;
  rateFocus: (focusId: number, rating: number) => void;
  rateMindset: (mindsetId: number, rating: number) => void;
  selectCollectionImage: (imageId: number) => void;
  selectCollectionSaying: (sayingId: number) => void;
  selectCollectionFocus: (focusId: number) => void;
  selectCollectionMindset: (mindsetId: number) => void;
  setActiveFociBrowserMode: (mode: FociBrowserMode) => void;
  setActiveMindsetsBrowserMode: (mode: MindsetsBrowserMode) => void;
  createMindsetDraft: () => void;
  assignFocusToSelectedMindset: (slotIndex: number, focusId: number) => void;
  updateSelectedMindsetName: (name: string) => void;
}

export type CompassStore = CompassStoreState & CompassStoreActions;
