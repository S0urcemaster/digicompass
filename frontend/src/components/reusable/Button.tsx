import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    compact?: boolean;
  }
>;

export function Button({ active = false, compact = false, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${active ? 'button-active' : ''} ${compact ? 'button-compact' : ''} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
