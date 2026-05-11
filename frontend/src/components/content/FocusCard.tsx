import type { Focus } from '../../types/domain';
import { Card } from '../reusable/Card';
import { PreviewCard } from '../reusable/PreviewCard';

interface FocusCardProps {
  focus: Focus;
  preview?: boolean;
  ratingInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
}

function getTextTone(color: string): 'light' | 'dark' {
  return color === 'dunkel' ? 'light' : 'dark';
}

function imageSource(url: string, preview: boolean): string {
  return preview ? `/images/preview/${url}` : `/images/${url}`;
}

export function FocusCard({ focus, preview = false, ratingInteractive = false, onRatingChange }: FocusCardProps) {
  const Wrapper = preview ? PreviewCard : Card;
  const categories = Array.from(new Set([focus.image.category, ...focus.saying.categories])).slice(0, 3);
  const textTone = getTextTone(focus.image.color);

  return (
    <Wrapper
      categories={categories}
      onRatingChange={onRatingChange}
      rating={focus.rating}
      ratingInteractive={ratingInteractive}
      tone={focus.image.color}
    >
      <img alt={focus.image.category} className="image-surface" src={imageSource(focus.image.url, preview)} />
      <div className={`focus-text focus-text-${textTone}`} style={{ fontSize: `${focus.saying.fontSize * (preview ? 0.38 : 0.58)}px` }}>
        {focus.saying.text}
      </div>
    </Wrapper>
  );
}
