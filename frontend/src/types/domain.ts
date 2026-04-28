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

export interface Anchor {
  saying: Saying;
  image: CompassImage;
  rating: Rating;
  notes: string;
}

export interface Mindset {
  name: string;
  anchors: Anchor[];
  rating: Rating;
  notes: string;
}

export interface DigiCompass {
  username: string;
  mindsets: Mindset[];
}
