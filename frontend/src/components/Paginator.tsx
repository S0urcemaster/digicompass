import type { PropsWithChildren } from 'react';

interface PaginatorProps extends PropsWithChildren {
  className?: string;
}

export const Paginator = ({ children, className = '' }: PaginatorProps) => (
  <div className={`paginator ${className}`.trim()}>{children}</div>
);
