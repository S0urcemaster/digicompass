import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = ({ children, className = '', type = 'button', ...props }: ButtonProps) => (
  <button type={type} className={`button ${className}`.trim()} {...props}>
    {children}
  </button>
);
