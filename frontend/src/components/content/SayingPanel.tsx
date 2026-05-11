import type { Saying } from '../../types/domain';
import { Card } from '../reusable/Card';
import { PreviewCard } from '../reusable/PreviewCard';

interface SayingPanelProps {
  saying: Saying;
  preview?: boolean;
  ratingInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function SayingPanel({ saying, preview = false, ratingInteractive = false, onRatingChange }: SayingPanelProps) {
  const Wrapper = preview ? PreviewCard : Card;

  return (
    <Wrapper
      categories={saying.categories.slice(0, 3)}
      onRatingChange={onRatingChange}
      rating={saying.rating}
      ratingInteractive={ratingInteractive}
      tone="mix"
    >
      <div className={`saying-panel ${preview ? 'saying-panel-preview' : ''}`} style={{ fontSize: `${saying.fontSize * (preview ? 0.38 : 0.56)}px` }}>
        {saying.text}
      </div>
    </Wrapper>
  );
}
