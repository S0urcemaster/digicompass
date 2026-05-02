import { Button } from '../../../components/Button';
import type { Rating } from '../../../types/domain';

type StarRatingProps = {
  buttonClassName?: string;
  className?: string;
  disabled?: boolean;
  rating: Rating;
  onChange?: (rating: Rating) => void;
  starClassName?: string;
  tone?: 'light' | 'dark';
};

const clampRating = (rating: number): Rating => Math.max(0, Math.min(1, rating));

export function StarRating({
  buttonClassName,
  className,
  disabled = false,
  rating,
  onChange,
  starClassName,
  tone = 'dark',
}: StarRatingProps) {
  const filledStars = Math.round(clampRating(rating) * 5);

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = clampRating((index + 1) / 5);
        const active = index < filledStars;

        return (
          <Button
            active={active}
            align="center"
            key={starValue}
            aria-label={`Bewertung auf ${index + 1} Sterne setzen`}
            className={`${buttonClassName ?? ''} ${starClassName ?? 'text-2xl'}`}
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            tone={tone}
            variant="star"
          >
            ★
          </Button>
        );
      })}
    </div>
  );
}
