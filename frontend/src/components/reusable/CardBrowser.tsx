import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Paginator } from './Paginator';

interface CardBrowserProps<T> {
  items: T[];
  selectedItem: T | null;
  getKey: (item: T) => string | number;
  onSelect: (item: T) => void;
  renderSelected: (item: T) => ReactNode;
  renderPreview: (item: T) => ReactNode;
}

const PREVIEW_PAGE_SIZE = 8;

export function CardBrowser<T>({
  items,
  selectedItem,
  getKey,
  onSelect,
  renderSelected,
  renderPreview,
}: CardBrowserProps<T>) {
  const [page, setPage] = useState(0);
  const selectedIndex = selectedItem ? items.indexOf(selectedItem) : 0;

  useEffect(() => {
    setPage(0);
  }, [items.length]);

  const previews = items.filter((item) => item !== selectedItem);
  const totalPages = Math.max(1, Math.ceil(previews.length / PREVIEW_PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = previews.slice(safePage * PREVIEW_PAGE_SIZE, safePage * PREVIEW_PAGE_SIZE + PREVIEW_PAGE_SIZE);

  return (
    <section className="browser-panel">
      <div className="card-browser">
        <div className="card-browser-selected">
          {selectedItem ? renderSelected(selectedItem) : <div className="empty-state">No selection</div>}
        </div>
        <div className="card-browser-top-grid">
          {pageItems.slice(0, 4).map((item) => (
            <button className="preview-slot" key={getKey(item)} onClick={() => onSelect(item)} type="button">
              {renderPreview(item)}
            </button>
          ))}
        </div>
        <div className="card-browser-bottom-row">
          {pageItems.slice(4).map((item) => (
            <button className="preview-slot" key={getKey(item)} onClick={() => onSelect(item)} type="button">
              {renderPreview(item)}
            </button>
          ))}
        </div>
      </div>
      <Paginator
        onNext={() => setPage((current) => (current + 1) % totalPages)}
        onPrevious={() => setPage((current) => (current - 1 + totalPages) % totalPages)}
        page={safePage}
        totalPages={selectedIndex >= 0 ? totalPages : 0}
      />
    </section>
  );
}
