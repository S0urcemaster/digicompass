export type TopView = "navigator" | "mindset" | "collection";
export type CollectionView = "images" | "sayings" | "foci" | "editor";
export type EditorTab = "foci" | "mindsets";
export type CardVariant = "selected" | "preview";

export type Saying = {
  id: number;
  text: string;
  fontSize: number;
  categories: string[];
  rating: number;
};

export type ImageItem = {
  id: number;
  url: string;
  color: "hell" | "dunkel" | "mix";
  category: string;
  rating: number;
};

export type Focus = {
  id: string;
  saying: Saying;
  imageUrl: string;
  imageColor: ImageItem["color"];
  imageCategory: string;
  rating: number;
  origin: "factory" | "user";
};

export type Mindset = {
  id: string;
  foci: Focus[];
  rating: number;
};

export type AppState = {
  topView: TopView;
  collectionView: CollectionView;
  editorTab: EditorTab;
  selectedSayingId: number;
  selectedImageId: number;
  selectedFactoryFocusId: string;
  selectedStoreFocusId: string | null;
  selectedMindsetFocusIds: string[];
  selectedMindsetId: string | null;
  focusedMindsetCardIndex: number;
  fullscreenFocus: boolean;
  factorySayingRatings: Record<number, number>;
  factoryImageRatings: Record<number, number>;
  factoryFocusRatings: Record<string, number>;
  storeSayings: Saying[];
  storeImages: ImageItem[];
  storeFoci: Focus[];
  storeMindsets: Mindset[];
  currentMindsetId: string | null;
};
