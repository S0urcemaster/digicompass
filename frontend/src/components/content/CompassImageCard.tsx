import type { CompassImage } from '../../types/domain';
import { Card } from '../reusable/Card';
import { PreviewCard } from '../reusable/PreviewCard';

interface CompassImageCardProps {
  image: CompassImage;
  preview?: boolean;
  ratingInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
}

function imageSource(image: CompassImage, preview: boolean): string {
  return preview ? `/images/preview/${image.url}` : `/images/${image.url}`;
}

export function CompassImageCard({
  image,
  preview = false,
  ratingInteractive = false,
  onRatingChange,
}: CompassImageCardProps) {
  const Wrapper = preview ? PreviewCard : Card;

  return (
    <Wrapper
      categories={[image.category]}
      onRatingChange={onRatingChange}
      rating={image.rating}
      ratingInteractive={ratingInteractive}
      tone={image.color}
    >
      <img alt={image.category} className="image-surface" src={imageSource(image, preview)} />
    </Wrapper>
  );
}
