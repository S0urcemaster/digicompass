import type { Rating, Saying } from '../../../types/domain';
import { CollectionSayingPanel } from './CollectionSayingPanel';

type CollectionSayingListProps = {
  layout?: 'list' | 'focus-eight' | 'collection-twelve';
  onSelect: (saying: Saying) => void;
  onSetRating: (saying: Saying, rating: Rating) => void;
  sayings: Saying[];
  selectedSayingId?: number | null;
  showSayingId?: boolean;
};

export function CollectionSayingList({
  layout = 'list',
  onSelect,
  onSetRating,
  sayings,
  selectedSayingId = null,
  showSayingId = false,
}: CollectionSayingListProps) {
  if (layout === 'collection-twelve') {
    return (
      <>
        <div className="grid grid-cols-1 gap-0 min-[900px]:hidden">
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

        <div className="hidden min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:gap-0">
          {sayings.map((saying) => (
            <CollectionSayingPanel
              key={saying.id}
              onSelect={() => onSelect(saying)}
              onSetRating={(rating) => onSetRating(saying, rating)}
              panelClassName="aspect-[20/7] shadow-none"
              saying={saying}
              selected={selectedSayingId === saying.id}
              showSayingId={showSayingId}
              variant="compact"
            />
          ))}
        </div>
      </>
    );
  }

  if (layout === 'focus-eight') {
    const topSayings = sayings.slice(0, 4);
    const bottomSayings = sayings.slice(4, 8);

    return (
      <>
        <div className="grid grid-cols-1 gap-0 min-[900px]:hidden">
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

        <div className="hidden min-[900px]:block">
          <div className="grid grid-cols-1 gap-0">
            {topSayings.map((saying) => (
              <CollectionSayingPanel
                key={saying.id}
                onSelect={() => onSelect(saying)}
                onSetRating={(rating) => onSetRating(saying, rating)}
                panelClassName="aspect-[20/7] shadow-none"
                saying={saying}
                selected={selectedSayingId === saying.id}
                showSayingId={showSayingId}
                variant="compact"
              />
            ))}
          </div>

          <div className="mt-0 grid grid-cols-2 gap-0">
            {bottomSayings.map((saying) => (
              <CollectionSayingPanel
                key={saying.id}
                onSelect={() => onSelect(saying)}
                onSetRating={(rating) => onSetRating(saying, rating)}
                panelClassName="aspect-[20/7] shadow-none"
                saying={saying}
                selected={selectedSayingId === saying.id}
                showSayingId={showSayingId}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0">
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
