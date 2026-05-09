import { useMemo, useState } from 'react';
import { Paginator } from './Paginator';
import { StarRating } from './StarRating';
import type { Saying } from '../types/domain';

interface SayingsBrowserProps {
  sayings: Saying[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onRate: (sayingId: number, rating: number) => void;
}

const PAGE_SIZE = 6;

export function SayingsBrowser({
  sayings,
  selectedIndex,
  onSelect,
  onRate,
}: SayingsBrowserProps) {
  const [page, setPage] = useState(0);
  const selectedSaying = sayings[selectedIndex];

  const pagedPreviewItems = useMemo(() => {
    const previewItems = sayings.filter((_, index) => index !== selectedIndex);
    const start = page * PAGE_SIZE;
    return {
      totalPages: Math.max(1, Math.ceil(previewItems.length / PAGE_SIZE)),
      items: previewItems.slice(start, start + PAGE_SIZE),
    };
  }, [page, sayings, selectedIndex]);

  if (!selectedSaying) {
    return <div className="empty-panel">No sayings available.</div>;
  }

  return (
    <section className="sayings-browser">
      <article className="saying-detail">
        <div className="card-categories">
          {selectedSaying.categories.map((category) => (
            <span key={category} className="card-category">
              {category}
            </span>
          ))}
        </div>
        <p className="saying-detail-text" style={{ fontSize: `${selectedSaying.fontSize / 16}rem` }}>
          {selectedSaying.text}
        </p>
        <StarRating rating={selectedSaying.rating} onChange={(rating) => onRate(selectedSaying.id, rating)} />
      </article>
      <div className="saying-preview-list">
        {pagedPreviewItems.items.map((saying) => {
          const sourceIndex = sayings.indexOf(saying);
          return (
            <button
              key={saying.id}
              type="button"
              className="saying-preview"
              onClick={() => onSelect(sourceIndex)}
            >
              <span className="saying-preview-text">{saying.text}</span>
            </button>
          );
        })}
      </div>
      <Paginator currentPage={page} totalPages={pagedPreviewItems.totalPages} onPageChange={setPage} />
    </section>
  );
}
