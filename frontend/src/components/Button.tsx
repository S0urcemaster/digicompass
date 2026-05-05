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
const ARROW_BUTTON_LABELS = new Set(['←', '→', '↑', '↓']);

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
  const defaultBg = tone === 'light' ? 'bg-[var(--button-bg-light)]' : 'bg-[var(--button-bg-dark)]';
  const activeBg = tone === 'light' ? 'bg-[var(--button-bg-light-active)]' : 'bg-[var(--button-bg-dark-active)]';

  if (variant === 'nav-tab') {
    if (disabled) {
      return `${defaultBg} text-muted ring-amber-950/10 opacity-70`;
    }

    if (active) {
      return `${activeBg} text-white ring-ink`;
    }

    return `${defaultBg} text-muted ring-amber-950/10 hover:text-ink`;
  }

  if (variant === 'tab') {
    if (disabled) {
      return `${defaultBg} text-muted ring-amber-950/10 opacity-70`;
    }

    if (active) {
      return `${activeBg} text-white ring-ink`;
    }

    return `${defaultBg} text-muted ring-amber-950/10 hover:text-ink`;
  }

  if (variant === 'star') {
    if (disabled) {
      if (active) {
        return 'text-[#ffd56a] opacity-85';
      }

      return tone === 'light' ? 'text-white/35 opacity-70' : 'text-[#1f1712]/28 opacity-70';
    }

    if (active) {
      return 'text-[#ffd56a] hover:scale-105';
    }

    return tone === 'light'
      ? 'text-white/55 hover:scale-105 hover:text-[#ffe19b]'
      : 'text-[#1f1712]/48 hover:scale-105 hover:text-[#ffe19b]';
  }

  if (variant === 'overlay-action') {
    return 'backdrop-blur';
  }

  if (variant === 'surface') {
    return selected
      ? `${activeBg} ring-2 ring-accent shadow-[0_18px_40px_rgba(212,138,31,0.24)]`
      : `${defaultBg} ring-1 ring-amber-950/10 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(32,26,24,0.14)]`;
  }

  if (variant === 'pager') {
    return `${defaultBg} text-ink`;
  }

  if (variant === 'toggle') {
    return active ? activeBg : defaultBg;
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
  tone = 'light',
  type = 'button',
  variant,
  ...props
}: ButtonProps) {
  const isArrowOnlyButton = typeof children === 'string' && ARROW_BUTTON_LABELS.has(children.trim());
  const classes = cn(
    variant === 'nav-tab' && 'px-4 py-2 text-base font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-100',
    variant === 'tab' && 'px-4 py-2 text-base font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-100',
    variant === 'star' && 'leading-none transition',
    variant === 'overlay-action' && 'flex items-center justify-center border font-semibold transition',
    variant === 'surface' && 'transition',
    variant === 'pager' &&
      'min-h-[3.25rem] px-5 py-3 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-45',
    variant === 'toggle' && 'transition',
    variant === 'scrim' && 'flex cursor-zoom-out items-center justify-center',
    isArrowOnlyButton && 'text-[2rem] leading-none',
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
