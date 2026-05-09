import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    compact?: boolean;
  }
>;

export function Button({ active = false, compact = false, className = '', ...props }: ButtonProps) {
  const classes = ['button', active ? 'is-active' : '', compact ? 'is-compact' : '', className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
