import { Button } from './Button';

interface StarRatingProps {
  rating: number;
}

const starValues = [0.2, 0.4, 0.6, 0.8, 1];

export const StarRating = ({ rating }: StarRatingProps) => (
  <div className="star-rating" aria-label={`Rating ${Math.round(rating * 5)} of 5`}>
    {starValues.map((value, index) => (
      <Button
        key={value}
        aria-hidden="true"
        className={`star-button ${rating >= value ? 'star-active' : 'star-inactive'}`}
        tabIndex={-1}
      >
        <span>{index < Math.round(rating * 5) ? '★' : '☆'}</span>
      </Button>
    ))}
  </div>
);
