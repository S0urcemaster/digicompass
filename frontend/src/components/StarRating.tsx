import { Button } from './Button';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
}

const values = [0.2, 0.4, 0.6, 0.8, 1];

export function StarRating({ rating, onChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {values.map((value) => (
        <Button
          key={value}
          type="button"
          className="star-button"
          active={rating >= value}
          onClick={() => onChange?.(value)}
        >
          ★
        </Button>
      ))}
    </div>
  );
}
