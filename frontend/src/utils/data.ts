import rawCategories from '../data/categories.json';
import rawImages from '../data/images.json';
import rawSayings from '../data/sayings.json';
import type { CompassImage, Saying } from '../types/domain';

export const categories = rawCategories as string[];
export const images = rawImages as CompassImage[];
export const sayings = rawSayings as Saying[];
