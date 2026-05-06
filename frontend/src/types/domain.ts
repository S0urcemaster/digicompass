export type Rating = number;
export type ImageColor = 'hell' | 'dunkel' | 'mix' | 'neutral';

export interface Category {
  id: number
  text: string;
}

export interface Saying {
  id: number
  text: string;
  fontSize: number;
  categories: Category[];
  rating: Rating;
}

export interface CompassImage {
  id: number
  url: string;
  color: ImageColor;
  categories: Category[];
  rating: Rating;
}

export interface Focus {
  saying: Saying;
  image: CompassImage;
  rating: Rating;
  notes: string;
}

export interface Collection {
  sayings: Saying[]
  images: CompassImage[]
  foci: Focus[]
  mindsets: Mindset[]
}

export interface Mindset {
  name: string;
  foci: Focus[]; // limited to 5
  rating: Rating;
  notes: string;
}

export interface DigiCompass {
  username: string;
  mindsets: Mindset[];
  collection: Collection
}
