import { Card } from './Card';
import type { Focus } from '../types/domain';

interface FocusCardProps {
  focus: Focus;
  onRate?: (rating: number) => void;
  size?: 'selected' | 'preview';
}

export function FocusCard({ focus, onRate, size = 'selected' }: FocusCardProps) {
  return (
    <Card
      categories={focus.saying.categories}
      rating={focus.rating}
      onRate={onRate}
      size={size}
      textTone={focus.image.color === 'dunkel' ? 'light' : 'dark'}
      backgroundImageUrl={`${size === 'preview' ? '/images/preview/' : '/images/'}${focus.image.url}`}
    >
      <p className="focus-card-text" style={{ fontSize: `${focus.saying.fontSize / 16}rem` }}>
        {focus.saying.text}
      </p>
    </Card>
  );
}
