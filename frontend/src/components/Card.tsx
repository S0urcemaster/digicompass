import type { PropsWithChildren } from 'react';
import { StarRating } from './StarRating';

interface CardProps extends PropsWithChildren {
  categories?: string[];
  rating?: number;
  onRate?: (rating: number) => void;
  size?: 'selected' | 'preview';
  textTone?: 'light' | 'dark';
  backgroundImageUrl?: string;
}

export function Card({
  categories = [],
  rating = 0,
  onRate,
  size = 'selected',
  textTone = 'dark',
  backgroundImageUrl,
  children,
}: CardProps) {
  return (
    <article
      className={`card card-${size} tone-${textTone}`}
      style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
    >
      <div className="card-header">
        <div className="card-categories">
          {categories.map((category) => (
            <span key={category} className="card-category">
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="card-body">{children}</div>
      <div className="card-footer">
        <div className="card-rating">
          <StarRating rating={rating} onChange={onRate} />
        </div>
      </div>
    </article>
  );
}
