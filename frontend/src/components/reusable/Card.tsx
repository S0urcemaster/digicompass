import type { PropsWithChildren, ReactNode } from 'react';
import { StarRating } from './StarRating';

interface CardProps extends PropsWithChildren {
  categories?: string[];
  rating: number;
  ratingInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
  footerContent?: ReactNode;
  preview?: boolean;
  tone?: string;
}

export function Card({
  categories = [],
  children,
  rating,
  ratingInteractive = false,
  onRatingChange,
  footerContent,
  preview = false,
  tone = 'mix',
}: CardProps) {
  return (
    <article className={`card ${preview ? 'card-preview' : 'card-selected'} tone-${tone}`}>
      <header className="card-header">
        {categories.map((category) => (
          <span className="card-chip" key={category}>
            {category}
          </span>
        ))}
      </header>
      <div className="card-body">{children}</div>
      <footer className="card-footer">
        {footerContent}
        <StarRating interactive={ratingInteractive} onChange={onRatingChange} rating={rating} />
      </footer>
    </article>
  );
}
