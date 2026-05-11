import { Button } from './Button';

interface PaginatorProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Paginator({ page, pageCount, onChange }: PaginatorProps) {
  const previousPage = (page - 1 + pageCount) % pageCount;
  const nextPage = (page + 1) % pageCount;

  return (
    <div className="paginator">
      <Button onClick={() => onChange(previousPage)}>Prev</Button>
      <div className="paginator__label">
        {page + 1} / {pageCount}
      </div>
      <Button onClick={() => onChange(nextPage)}>Next</Button>
    </div>
  );
}
