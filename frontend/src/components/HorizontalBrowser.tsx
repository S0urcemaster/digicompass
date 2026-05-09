import { useState } from 'react';
import type { ReactNode } from 'react';
import { Paginator } from './Paginator';

interface HorizontalBrowserProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => ReactNode;
}

export function HorizontalBrowser<T>({
  items,
  pageSize = 4,
  renderItem,
}: HorizontalBrowserProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = page * pageSize;
  const visibleItems = items.slice(start, start + pageSize);

  return (
    <section className="horizontal-browser">
      <div className="horizontal-browser-row">
        {visibleItems.map((item, index) => renderItem(item, start + index))}
      </div>
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
