import { Card } from './Card';
import { CategoryTagList } from './CategoryTagList';
import { StarRating } from './StarRating';
import type { Focus } from '../domain/types';

interface FocusCardProps {
  focus: Focus;
  selected?: boolean;
  preview?: boolean;
}

const getTextToneClassName = (tone: string) => {
  if (tone === 'hell') {
    return 'focus-card-text-dark';
  }

  return 'focus-card-text-light';
};

const getImagePath = (url: string, preview: boolean) =>
  `/images/${preview ? `preview/${url}` : url}`;

export const FocusCard = ({ focus, selected = false, preview = false }: FocusCardProps) => {
  const categories = Array.from(new Set([...focus.saying.categories, focus.image.category]));

  return (
    <Card
      className={`focus-card ${selected ? 'focus-card-selected' : ''} ${
        preview ? 'focus-card-preview' : ''
      } ${getTextToneClassName(focus.image.color)}`}
    >
      <img
        alt={focus.image.category}
        className="focus-card-image"
        src={getImagePath(focus.image.url, preview)}
      />
      <div className="focus-card-overlay" />
      <div className="focus-card-content">
        <CategoryTagList categories={categories} />
        <p
          className="focus-card-text"
          style={{ fontSize: `${preview ? Math.max(13, focus.saying.fontSize / 3) : focus.saying.fontSize / 4}px` }}
        >
          {focus.saying.text}
        </p>
        <StarRating rating={focus.rating} />
      </div>
    </Card>
  );
};
