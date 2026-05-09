import { Button } from './Button';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="paginator">
      <Button compact type="button" onClick={() => onPageChange(Math.max(0, currentPage - 1))}>
        Prev
      </Button>
      <span className="paginator-status">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        compact
        type="button"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
      >
        Next
      </Button>
    </div>
  );
}
