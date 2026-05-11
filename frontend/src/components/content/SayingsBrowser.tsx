import type { Saying } from '../../types/domain';
import { CardBrowser } from '../reusable/CardBrowser';
import { SayingPanel } from './SayingPanel';

interface SayingsBrowserProps {
  sayings: Saying[];
  selectedSaying: Saying | null;
  onSelect: (saying: Saying) => void;
  onRate: (saying: Saying, rating: number) => void;
}

export function SayingsBrowser({ sayings, selectedSaying, onSelect, onRate }: SayingsBrowserProps) {
  return (
    <CardBrowser
      getKey={(saying) => saying.id}
      items={sayings}
      onSelect={onSelect}
      renderPreview={(saying) => <SayingPanel preview saying={saying} />}
      renderSelected={(saying) => (
        <SayingPanel
          onRatingChange={(rating) => onRate(saying, rating)}
          ratingInteractive
          saying={saying}
        />
      )}
      selectedItem={selectedSaying}
    />
  );
}
