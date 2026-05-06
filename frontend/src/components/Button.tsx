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
const BORDER_CLASS_NAME = 'border border-[#504a48]';

const getShapeClassName = (_shape: ButtonShape) => {
  return '';
};

const getButtonStateClassName = ({
  active,
  disabled,
  selected,
  tone,
}: Pick<ButtonProps, 'active' | 'disabled' | 'selected' | 'tone'>) => {
  const defaultBg = tone === 'light' ? 'bg-[var(--button-bg-light)]' : 'bg-[var(--button-bg-dark)]';
  const activeBg = tone === 'light' ? 'bg-[var(--button-bg-light-active)]' : 'bg-[var(--button-bg-dark-active)]';
  const defaultText = tone === 'light' ? 'text-ink' : 'text-[#fff7ed]';

  if (disabled) {
    return `${defaultBg} ${defaultText} opacity-45`;
  }

  if (active || selected) {
    return `${activeBg} text-white`;
  }

  return `${defaultBg} ${defaultText}`;
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
  const baseButtonClassName = `${BORDER_CLASS_NAME} appearance-none border-solid font-semibold`;
  const classes = cn(
    baseButtonClassName,
    variant === 'scrim'
      ? 'flex cursor-zoom-out items-center justify-center bg-black/84'
      : `${controlButtonClassName} disabled:cursor-not-allowed`,
    variant === 'overlay-action' && 'flex items-center justify-center',
    variant === 'star' && 'leading-none',
    isArrowOnlyButton && 'text-[2rem] leading-none',
    fullWidth && 'w-full',
    align === 'left' && 'text-left',
    getShapeClassName(shape),
    getButtonStateClassName({ active, disabled, selected, tone }),
    className
  );

  return (
    <button className={classes} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
}
