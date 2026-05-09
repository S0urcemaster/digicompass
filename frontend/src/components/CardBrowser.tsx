import { useEffect, useState } from 'react';
import { Paginator } from './Paginator';
import type { ReactNode } from 'react';

interface CardBrowserProps<T> {
  items: T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  renderSelected: (item: T) => ReactNode;
  renderPreview: (item: T) => ReactNode;
}

const PREVIEW_COUNT = 8;

export function CardBrowser<T>({
  items,
  selectedIndex,
  onSelect,
  renderSelected,
  renderPreview,
}: CardBrowserProps<T>) {
  const [page, setPage] = useState(0);
  const selectedItem = items[selectedIndex];
  const previewItems = items.filter((_, index) => index !== selectedIndex);
  const totalPages = Math.max(1, Math.ceil(previewItems.length / PREVIEW_COUNT));
  const pageStart = page * PREVIEW_COUNT;
  const visiblePreviews = previewItems.slice(pageStart, pageStart + PREVIEW_COUNT);

  useEffect(() => {
    setPage(0);
  }, [selectedIndex, items.length]);

  if (!selectedItem) {
    return <div className="empty-panel">No items available.</div>;
  }

  return (
    <section className="card-browser">
      <div className="card-browser-top">
        <div className="card-browser-selected">{renderSelected(selectedItem)}</div>
        <div className="card-browser-preview-grid">
          {visiblePreviews.slice(0, 4).map((item) => {
            const sourceIndex = items.indexOf(item);
            return (
              <button
                key={sourceIndex}
                type="button"
                className="card-browser-preview-button"
                onClick={() => onSelect(sourceIndex)}
              >
                {renderPreview(item)}
              </button>
            );
          })}
        </div>
      </div>
      <div className="card-browser-bottom-row">
        {visiblePreviews.slice(4, 8).map((item) => {
          const sourceIndex = items.indexOf(item);
          return (
            <button
              key={sourceIndex}
              type="button"
              className="card-browser-preview-button"
              onClick={() => onSelect(sourceIndex)}
            >
              {renderPreview(item)}
            </button>
          );
        })}
      </div>
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
