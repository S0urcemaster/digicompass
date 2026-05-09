import type { CSSProperties } from 'react';
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
  const textScale = Math.max(0.68, Math.min(focus.saying.fontSize / 56, 1.18));
  const cardStyle = { '--focus-text-scale': String(textScale) } as CSSProperties;

  return (
    <Card
      className={`focus-card ${selected ? 'focus-card-selected' : ''} ${
        preview ? 'focus-card-preview' : ''
      } ${getTextToneClassName(focus.image.color)}`}
      style={cardStyle}
    >
      <img
        alt={focus.image.category}
        className="focus-card-image"
        src={getImagePath(focus.image.url, preview)}
      />
      <div className="focus-card-overlay" />
      <div className="focus-card-content">
        <div className="focus-card-header">
          <CategoryTagList categories={categories} />
        </div>
        <div className="focus-card-body">
          <p className="focus-card-text">{focus.saying.text}</p>
        </div>
        <div className="focus-card-footer">
          <StarRating rating={focus.rating} />
        </div>
      </div>
    </Card>
  );
};
