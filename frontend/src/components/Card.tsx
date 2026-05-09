import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

interface CardProps
  extends PropsWithChildren,
    Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <article className={`card ${className}`.trim()} {...props}>
    {children}
  </article>
);
