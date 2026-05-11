import { StarRating } from './StarRating';
import type { CompassImage, Saying } from '../types/domain';

interface CardProps {
  image?: CompassImage;
  saying?: Saying;
  rating: number;
  onRate: (rating: number) => void;
  size?: 'selected' | 'preview';
}

export function Card({ image, saying, rating, onRate, size = 'selected' }: CardProps) {
  const toneClass = image?.color === 'dunkel' ? 'card--light-text' : 'card--dark-text';

  return (
    <article
      className={['card', size === 'preview' ? 'card--preview' : 'card--selected', toneClass].filter(Boolean).join(' ')}
      style={image ? { backgroundImage: `url(/images/${size === 'preview' ? 'preview/' : ''}${image.url})` } : undefined}
    >
      <header className="card__header">
        {saying?.categories.slice(0, 3).map((category) => (
          <span key={category} className="card__category">
            {category}
          </span>
        ))}
      </header>
      <div className="card__body">
        {saying ? (
          <p className="card__saying" style={{ fontSize: `${saying.fontSize * (size === 'preview' ? 0.32 : 0.5)}px` }}>
            {saying.text}
          </p>
        ) : null}
      </div>
      <footer className="card__footer">
        <StarRating value={rating} onChange={onRate} />
      </footer>
    </article>
  );
}
