import { Button } from '../../../components/Button';
import type { Rating } from '../../../types/domain';

type StarRatingVariant = 'image-main' | 'image-preview' | 'saying-main' | 'saying-preview' | 'mindset';

type StarRatingProps = {
  allowClear?: boolean;
  className?: string;
  disabled?: boolean;
  rating: Rating;
  onChange?: (rating: Rating) => void;
  tone?: 'light' | 'dark';
  variant?: StarRatingVariant;
};

const clampRating = (rating: number): Rating => Math.max(0, Math.min(1, rating));

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const STAR_RATING_VARIANTS: Record<
  StarRatingVariant,
  {
    buttonClassName: string;
    className: string;
    starClassName: string;
  }
> = {
  'image-main': {
    buttonClassName: 'flex-1 text-center',
    className: 'w-full justify-between rounded-full px-2 py-2',
    starClassName: 'text-[3.25rem]',
  },
  'image-preview': {
    buttonClassName: 'flex-1 text-center',
    className: 'w-full justify-center gap-0.5 rounded-full px-1.5 py-1',
    starClassName: 'text-[0.9rem]',
  },
  'saying-main': {
    buttonClassName: 'flex-1 text-center',
    className: 'w-full justify-between bg-[#fff7ed]/92 px-2 py-2 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.12)]',
    starClassName: 'text-[3.25rem]',
  },
  'saying-preview': {
    buttonClassName: 'flex-1 text-center',
    className: 'w-full justify-between bg-[#fff7ed]/92 px-1.5 py-1.5 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.12)]',
    starClassName: 'text-[1.9rem]',
  },
  mindset: {
    buttonClassName: 'flex h-[1.85rem] w-[1.85rem] items-center justify-center p-0 leading-none',
    className: 'shrink-0 items-start justify-center rounded-full border border-amber-950/10 bg-white/85 px-2.5 py-1 text-[#1f1712]',
    starClassName: 'text-[2.15rem] leading-none',
  },
};

export function StarRating({
  allowClear = true,
  className,
  disabled = false,
  rating,
  onChange,
  tone = 'dark',
  variant = 'saying-main',
}: StarRatingProps) {
  const filledStars = Math.round(clampRating(rating) * 5);
  const styles = STAR_RATING_VARIANTS[variant];

  return (
    <div className={cn('flex items-center gap-1.5', styles.className, className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = clampRating((index + 1) / 5);
        const active = index < filledStars;
        const clearsRating = allowClear && active && index === filledStars - 1;

        return (
          <Button
            active={active}
            align="center"
            key={starValue}
            aria-label={clearsRating ? 'Bewertung zurücksetzen' : `Bewertung auf ${index + 1} Sterne setzen`}
            className={styles.buttonClassName}
            disabled={disabled}
            onClick={() => onChange?.(clearsRating ? 0 : starValue)}
            tone={tone}
            variant="star"
          >
            <span aria-hidden="true" className={cn('inline-flex items-center justify-center', styles.starClassName)}>
              ★
            </span>
          </Button>
        );
      })}
    </div>
  );
}
