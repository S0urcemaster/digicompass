import { useState } from 'react';
import { Card } from './Card';
import { Paginator } from './Paginator';
import type { CompassImage, Saying } from '../types/domain';

interface CardBrowserItem {
  id: number;
  image: CompassImage;
  saying?: Saying;
  rating: number;
}

interface CardBrowserProps {
  items: CardBrowserItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRate: (id: number, rating: number) => void;
}

export function CardBrowser({ items, selectedId, onSelect, onRate }: CardBrowserProps) {
  const [page, setPage] = useState(0);
  if (items.length === 0) {
    return <div className="empty-state">No cards available.</div>;
  }

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const previewItems = items.filter((item) => item.id !== selectedItem.id);
  const perPage = 8;
  const pageCount = Math.max(1, Math.ceil(previewItems.length / perPage));
  const pagedItems = previewItems.slice(page * perPage, page * perPage + perPage);
  const topPreviewItems = pagedItems.slice(0, 4);
  const bottomPreviewItems = pagedItems.slice(4, 8);

  return (
    <section className="card-browser">
      <div className="card-browser__hero-row">
        <button className="card-browser__selected" type="button" onClick={() => onSelect(selectedItem.id)}>
          <Card
            image={selectedItem.image}
            saying={selectedItem.saying}
            rating={selectedItem.rating}
            onRate={(rating) => onRate(selectedItem.id, rating)}
          />
        </button>
        <div className="card-browser__preview-grid">
          {topPreviewItems.map((item) => (
            <button key={item.id} className="card-browser__preview" type="button" onClick={() => onSelect(item.id)}>
              <Card
                image={item.image}
                saying={item.saying}
                rating={item.rating}
                onRate={(rating) => onRate(item.id, rating)}
                size="preview"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="card-browser__bottom-row">
        {bottomPreviewItems.map((item) => (
          <button key={item.id} className="card-browser__preview" type="button" onClick={() => onSelect(item.id)}>
            <Card
              image={item.image}
              saying={item.saying}
              rating={item.rating}
              onRate={(rating) => onRate(item.id, rating)}
              size="preview"
            />
          </button>
        ))}
      </div>
      <Paginator page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
