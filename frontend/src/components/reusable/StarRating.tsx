import { isStarActive, toStarValue } from '../../utils/rating';
import { StarButton } from './StarButton';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {Array.from({ length: 5 }, (_, index) => (
        <StarButton
          key={index}
          active={isStarActive(rating, index)}
          disabled={!interactive}
          onSelect={interactive && onChange ? () => onChange(toStarValue(index)) : undefined}
        />
      ))}
    </div>
  );
}
