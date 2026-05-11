import { Button } from './Button';

interface PaginatorProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Paginator({ page, totalPages, onPrevious, onNext }: PaginatorProps) {
  return (
    <div className="triple-row">
      <Button onClick={onPrevious}>Previous</Button>
      <div className="paginator-status">
        {totalPages === 0 ? '0 / 0' : `${page + 1} / ${totalPages}`}
      </div>
      <Button onClick={onNext}>Next</Button>
    </div>
  );
}
