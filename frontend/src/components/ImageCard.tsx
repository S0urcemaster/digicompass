import { Card } from './Card';
import type { CompassImage } from '../types/domain';

interface ImageCardProps {
  image: CompassImage;
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'selected' | 'preview';
}

export function ImageCard({ image, rating, onRate, size = 'selected' }: ImageCardProps) {
  return (
    <Card
      categories={[image.category]}
      rating={rating}
      onRate={onRate}
      size={size}
      textTone={image.color === 'dunkel' ? 'light' : 'dark'}
      backgroundImageUrl={`${size === 'preview' ? '/images/preview/' : '/images/'}${image.url}`}
    />
  );
}
