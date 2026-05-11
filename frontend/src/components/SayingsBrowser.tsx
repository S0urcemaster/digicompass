import { useState } from 'react';
import { Paginator } from './Paginator';
import { StarRating } from './StarRating';
import type { Saying } from '../types/domain';

interface SayingsBrowserProps {
  items: Saying[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRate: (id: number, rating: number) => void;
}

export function SayingsBrowser({ items, selectedId, onSelect, onRate }: SayingsBrowserProps) {
  const [page, setPage] = useState(0);
  if (items.length === 0) {
    return <div className="empty-state">No sayings available.</div>;
  }

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const previewItems = items.filter((item) => item.id !== selectedItem.id);
  const perPage = 6;
  const pageCount = Math.max(1, Math.ceil(previewItems.length / perPage));
  const pagedItems = previewItems.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="sayings-browser">
      <button type="button" className="saying-card saying-card--selected" onClick={() => onSelect(selectedItem.id)}>
        <div className="saying-card__categories">
          {selectedItem.categories.slice(0, 3).map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
        <p style={{ fontSize: `${selectedItem.fontSize * 0.5}px` }}>{selectedItem.text}</p>
        <StarRating value={selectedItem.rating} onChange={(rating) => onRate(selectedItem.id, rating)} />
      </button>
      <div className="sayings-browser__grid">
        {pagedItems.map((item) => (
          <button key={item.id} type="button" className="saying-card" onClick={() => onSelect(item.id)}>
            <div className="saying-card__categories">
              {item.categories.slice(0, 2).map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <p style={{ fontSize: `${item.fontSize * 0.32}px` }}>{item.text}</p>
            <StarRating value={item.rating} onChange={(rating) => onRate(item.id, rating)} />
          </button>
        ))}
      </div>
      <Paginator page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
