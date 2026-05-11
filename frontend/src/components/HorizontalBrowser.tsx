import type { ReactNode } from 'react';
import { Paginator } from './Paginator';
import { useState } from 'react';

interface HorizontalBrowserItem {
  id: number | string;
  content: ReactNode;
}

interface HorizontalBrowserProps {
  items: HorizontalBrowserItem[];
}

export function HorizontalBrowser({ items }: HorizontalBrowserProps) {
  const [page, setPage] = useState(0);
  if (items.length === 0) {
    return <div className="empty-state">No items available.</div>;
  }

  const perPage = 4;
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const pagedItems = items.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="horizontal-browser">
      <div className="horizontal-browser__row">
        {pagedItems.map((item) => (
          <div key={item.id} className="horizontal-browser__item">
            {item.content}
          </div>
        ))}
      </div>
      <Paginator page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
