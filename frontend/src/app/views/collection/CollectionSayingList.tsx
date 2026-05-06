import type { Rating, Saying } from '../../../types/domain';
import { CollectionSayingPanel } from './CollectionSayingPanel';

type CollectionSayingListProps = {
  onSelect: (saying: Saying) => void;
  onSetRating: (saying: Saying, rating: Rating) => void;
  sayings: Saying[];
  selectedSayingId?: number | null;
  showSayingId?: boolean;
};

export function CollectionSayingList({
  onSelect,
  onSetRating,
  sayings,
  selectedSayingId = null,
  showSayingId = false,
}: CollectionSayingListProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {sayings.map((saying) => (
        <CollectionSayingPanel
          key={saying.id}
          onSelect={() => onSelect(saying)}
          onSetRating={(rating) => onSetRating(saying, rating)}
          panelClassName="shadow-none"
          saying={saying}
          selected={selectedSayingId === saying.id}
          showSayingId={showSayingId}
          variant="preview"
        />
      ))}
    </div>
  );
}
