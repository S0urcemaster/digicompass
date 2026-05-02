import type { CSSProperties } from 'react';

type TabItem<T extends string> = {
  disabled?: boolean;
  label: string;
  value: T;
};

type TabsProps<T extends string> = {
  activeValue: T;
  className?: string;
  items: TabItem<T>[];
  onChange?: (value: T) => void;
  style?: CSSProperties;
};

const TAB_BUTTON_CLASS =
  'w-full rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:cursor-not-allowed disabled:opacity-100';

const getTabButtonClassName = (active: boolean, disabled = false) => {
  if (disabled) {
    return `${TAB_BUTTON_CLASS} bg-white/70 text-muted ring-amber-950/10`;
  }

  if (active) {
    return `${TAB_BUTTON_CLASS} bg-ink text-white ring-ink shadow-[0_10px_24px_rgba(32,26,24,0.18)]`;
  }

  return `${TAB_BUTTON_CLASS} bg-white/80 text-muted ring-amber-950/10 hover:bg-white hover:text-ink`;
};

export function Tabs<T extends string>({ activeValue, className, items, onChange, style }: TabsProps<T>) {
  return (
    <div className={className} style={style}>
      {items.map((item) => (
        <button
          key={item.value}
          className={getTabButtonClassName(activeValue === item.value, item.disabled)}
          disabled={item.disabled}
          onClick={() => onChange?.(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
