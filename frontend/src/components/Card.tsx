import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <article className={`card ${className}`.trim()}>{children}</article>
);
