export type Rating = number;

export interface Category {
  id: number
  text: string;
}

export interface Saying {
  id: number
  text: string;
  categories: Category[];
  rating: Rating;
}

export interface CompassImage {
  id: number
  url: string;
  categories: Category[];
  rating: Rating;
}

export interface Focus {
  saying: Saying;
  image: CompassImage;
  rating: Rating;
  notes: string;
}

export interface Mindset {
  name: string;
  foci: Focus[];
  rating: Rating;
  notes: string;
}

export interface DigiCompass {
  username: string;
  mindsets: Mindset[];
}
