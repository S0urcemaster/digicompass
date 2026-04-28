export type Rating = number;

export interface Category {
  text: string;
}

export interface Saying {
  text: string;
  categories: Category[];
  rating: Rating;
}

export interface CompassImage {
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
