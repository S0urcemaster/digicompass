import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Paginator } from './Paginator';

interface HorizontalBrowserProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  onSelect: (item: T) => void;
  renderItem: (item: T) => ReactNode;
}

const PAGE_SIZE = 4;

export function HorizontalBrowser<T>({ items, getKey, onSelect, renderItem }: HorizontalBrowserProps<T>) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="browser-panel">
      <div className="horizontal-browser">
        {pageItems.map((item) => (
          <button className="horizontal-browser-item" key={getKey(item)} onClick={() => onSelect(item)} type="button">
            {renderItem(item)}
          </button>
        ))}
      </div>
      <Paginator
        onNext={() => setPage((current) => (current + 1) % totalPages)}
        onPrevious={() => setPage((current) => (current - 1 + totalPages) % totalPages)}
        page={page}
        totalPages={totalPages}
      />
    </section>
  );
}
