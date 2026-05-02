import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ButtonVariant =
  | 'nav-tab'
  | 'tab'
  | 'star'
  | 'overlay-action'
  | 'surface'
  | 'pager'
  | 'toggle'
  | 'scrim';

type ButtonTone = 'light' | 'dark';
type ButtonShape = 'pill' | 'round' | 'none';
type ButtonAlign = 'center' | 'left';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  active?: boolean;
  align?: ButtonAlign;
  children: ReactNode;
  fullWidth?: boolean;
  selected?: boolean;
  shape?: ButtonShape;
  tone?: ButtonTone;
  variant?: ButtonVariant;
};

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const getShapeClassName = (shape: ButtonShape) => {
  if (shape === 'pill') {
    return 'rounded-full';
  }

  if (shape === 'round') {
    return 'rounded-full';
  }

  return '';
};

const getVariantClassName = ({
  active,
  disabled,
  selected,
  tone,
  variant,
}: Pick<ButtonProps, 'active' | 'disabled' | 'selected' | 'tone' | 'variant'>) => {
  if (variant === 'nav-tab') {
    if (disabled) {
      return 'bg-white/70 text-muted ring-amber-950/10';
    }

    if (active) {
      return 'bg-ink text-white ring-ink';
    }

    return 'bg-white/80 text-muted ring-amber-950/10 hover:bg-white hover:text-ink';
  }

  if (variant === 'tab') {
    if (disabled) {
      return 'bg-white/70 text-muted ring-amber-950/10';
    }

    if (active) {
      return 'bg-ink text-white ring-ink';
    }

    return 'bg-white/80 text-muted ring-amber-950/10 hover:bg-white hover:text-ink';
  }

  if (variant === 'star') {
    if (disabled) {
      return tone === 'light' ? 'text-[#1f1712]/28' : 'text-white/35';
    }

    if (active) {
      return tone === 'light' ? 'text-[#8b4d16] hover:scale-105' : 'text-[#ffd56a] hover:scale-105';
    }

    return tone === 'light'
      ? 'text-[#1f1712]/48 hover:scale-105 hover:text-[#8b4d16]'
      : 'text-white/55 hover:scale-105 hover:text-[#ffe19b]';
  }

  if (variant === 'overlay-action') {
    return tone === 'light'
      ? 'border-[#1f1712]/78 bg-[#1f1712]/88 text-[#f6efe2] backdrop-blur hover:bg-[#17110d]'
      : 'border-white/78 bg-[#fff7ed]/90 text-[#1f1712] backdrop-blur hover:bg-[#fffaf4]';
  }

  if (variant === 'surface') {
    return selected
      ? 'ring-2 ring-accent shadow-[0_18px_40px_rgba(212,138,31,0.24)]'
      : 'ring-1 ring-amber-950/10 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(32,26,24,0.14)]';
  }

  if (variant === 'pager') {
    return 'bg-[#efe2cc] text-ink hover:bg-[#e8d5b6]';
  }

  if (variant === 'toggle') {
    return active ? 'bg-ink' : 'bg-[#d8c8b2]';
  }

  if (variant === 'scrim') {
    return 'bg-black/84';
  }

  return '';
};

export function Button({
  active = false,
  align = 'center',
  children,
  className,
  disabled = false,
  fullWidth = false,
  selected = false,
  shape = 'none',
  tone = 'dark',
  type = 'button',
  variant,
  ...props
}: ButtonProps) {
  const classes = cn(
    variant === 'nav-tab' && 'px-4 py-2 text-sm font-medium ring-1 transition disabled:cursor-not-allowed disabled:opacity-100',
    variant === 'tab' && 'px-4 py-2 text-sm font-medium ring-1 transition disabled:cursor-not-allowed disabled:opacity-100',
    variant === 'star' && 'leading-none transition',
    variant === 'overlay-action' && 'flex items-center justify-center border font-semibold transition',
    variant === 'surface' && 'transition',
    variant === 'pager' &&
      'min-h-[3.25rem] px-5 py-3 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-45',
    variant === 'toggle' && 'transition',
    variant === 'scrim' && 'flex cursor-zoom-out items-center justify-center',
    fullWidth && 'w-full',
    align === 'left' && 'text-left',
    getShapeClassName(shape),
    getVariantClassName({ active, disabled, selected, tone, variant }),
    className
  );

  return (
    <button className={classes} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
}
