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
const BORDER_CLASS_NAME = 'border border-black';

const getShapeClassName = (_shape: ButtonShape) => {
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
  const disabledSurface = `${defaultBg} text-muted opacity-45`;

  if (variant === 'nav-tab') {
    if (disabled) {
      return disabledSurface;
    }

    if (active) {
      return `${activeBg} text-white`;
    }

    return `${defaultBg} text-muted`;
  }

  if (variant === 'tab') {
    if (disabled) {
      return disabledSurface;
    }

    if (active) {
      return `${activeBg} text-white`;
    }

    return `${defaultBg} text-muted`;
  }

  if (variant === 'star') {
    if (disabled) {
      if (active) {
        return 'text-[#ffd56a] opacity-45';
      }

      return tone === 'light' ? 'text-white/35 opacity-45' : 'text-[#1f1712]/28 opacity-45';
    }

    if (active) {
      return 'text-[#ffd56a]';
    }

    return tone === 'light'
      ? 'text-white/55'
      : 'text-[#1f1712]/48';
  }

  if (variant === 'overlay-action') {
    return disabled ? 'backdrop-blur opacity-45' : 'backdrop-blur';
  }

  if (variant === 'surface') {
    if (disabled) {
      return disabledSurface;
    }

    return selected ? activeBg : defaultBg;
  }

  if (variant === 'pager') {
    return disabled ? `${defaultBg} text-ink opacity-45` : `${defaultBg} text-ink`;
  }

  if (variant === 'toggle') {
    if (disabled) {
      return disabledSurface;
    }

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
  const controlButtonClassName = 'min-h-[3rem] px-4 py-2 text-base font-semibold';
  const baseButtonClassName = 'appearance-none border-solid';
  const classes = cn(
    baseButtonClassName,
    variant === 'nav-tab' && `${controlButtonClassName} ${BORDER_CLASS_NAME} disabled:cursor-not-allowed`,
    variant === 'tab' && `${controlButtonClassName} ${BORDER_CLASS_NAME} disabled:cursor-not-allowed`,
    variant === 'star' && 'leading-none',
    variant === 'overlay-action' && `flex items-center justify-center ${BORDER_CLASS_NAME} font-semibold`,
    variant === 'surface' && BORDER_CLASS_NAME,
    variant === 'pager' && `${controlButtonClassName} ${BORDER_CLASS_NAME} disabled:cursor-not-allowed`,
    variant === 'toggle' && `${BORDER_CLASS_NAME} disabled:cursor-not-allowed`,
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
