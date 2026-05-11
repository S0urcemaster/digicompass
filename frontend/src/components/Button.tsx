import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export function Button({ children, active = false, className = '', type = 'button', ...props }: ButtonProps) {
  const classes = ['button', active ? 'is-active' : '', className].filter(Boolean).join(' ');

  return (
    <button {...props} type={type} className={classes}>
      {children}
    </button>
  );
}
