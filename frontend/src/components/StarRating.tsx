import { StarButton } from './StarButton';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

const starValues = [0.2, 0.4, 0.6, 0.8, 1];

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {starValues.map((starValue) => (
        <StarButton key={starValue} active={value >= starValue} onClick={() => onChange(starValue)} />
      ))}
    </div>
  );
}
